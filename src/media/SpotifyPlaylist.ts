import Playlist from './Playlist.js';
import config from '../config.json' with {type: 'json'};
import {SpotifyEpisode, SpotifyPlaylistInfo, SpotifyPlaylistTracks, SpotifyTrack} from "../@types/spotify.js";
import {DBPlaylist, DBTrack} from "../database/sequelize.js";
import {access_token} from "../authorize.js";
import * as child_process from "node:child_process";

const isTrack = (track: SpotifyTrack | SpotifyEpisode): track is SpotifyTrack => {
    return track.type === 'track';
}

class SpotifyPlaylist extends Playlist {
    private info: SpotifyPlaylistInfo | null;
    private tracks: string[] | null;

    public constructor (spotifyId: string) {
        super(spotifyId);

        this.info = null;
        this.tracks = null;
    }

    public getInfo(): SpotifyPlaylistInfo | null {
        return this.info;
    }

    public getTracks(): string[] | null {
        return this.tracks;
    }

    public async load () {
        this.info = await fetch(`https://api.spotify.com/v1/playlists/${this.id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer  ${access_token}`
            }
        }).then(res => res.json());

        if (this.info === null) {
            throw new Error(`Failed to load playlist: ${this.id}`);
        }

        this.tracks = this.info.tracks.items.map(item => item.track).filter(isTrack).map(track => track.id);

        let next = this.info.tracks.next;

        while (next !== null) {
            const res: SpotifyPlaylistTracks = await fetch(next, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer  ${access_token}`
                }
            }).then(res => res.json());

            res.items.forEach(item => this.tracks!.push(item.track.id));

            next = res.next;
        }
    }

    public async importExistingTracks (): Promise<void> {
        const missing = await this.getMissingTracks();
        const existing = (await DBTrack.findAll({where: {source: 'spotify'}})).map(track => track.track);

        const link = existing.filter(track => missing.includes(track));

        const [dbPlaylist] = await DBPlaylist.findOrCreate({where: {playlist: this.id}});

        console.log(`Linking ${link.length} existing tracks`);
        for (let i = 0; i < link.length; i++) {
            await dbPlaylist.addDBTrack((await DBTrack.findOne({where:{track:link[i]}}))!)
        }
    }

    public async getMissingTracks (): Promise<string[]> {
        if (this.tracks === null) {
            throw new Error('Playlist must be loaded before fetching missing tracks.');
        }

        const [dbPlaylist] = await DBPlaylist.findOrCreate({
            where: {
                playlist: this.id,
                source: 'spotify'
            }
        });

        const localTracks = (await dbPlaylist.getDBTracks()).map(track => track.track);
        const remoteTracks = this.tracks;

        return remoteTracks.filter(track => !localTracks.includes(track));
    }

    public download (): Promise<void> {
        return new Promise(async (resolve) => {
            await this.importExistingTracks();
            const missing = await this.getMissingTracks();
            const totalLength = missing.length;

            if (totalLength === 0) {
                console.log(`No new tracks found.`);
                resolve();
                return;
            }
            console.log(`Downloading ${totalLength} tracks`);

            let processing = false;
            let currentTrack: string | null = null;
            let currentChild: any = null;

            const process = async (): Promise<void> => {
                if (!processing) {
                    if (missing.length === 0) {
                        resolve();
                        return;
                    }
                    processing = true;
                    console.log(`Downloading track ${totalLength - missing.length + 1} of ${totalLength}`);
                    currentTrack = missing.shift() ?? null;
                    if(currentTrack === null) {
                        console.warn('Null track');
                    }
                    currentChild = child_process.exec(`freyr -d ${config.output} spotify:track:${currentTrack}`);
                    setTimeout(process, 50);
                } else if (currentChild.exitCode !== null) {
                    processing = false;
                    if (currentChild.exitCode !== 0) {
                        console.log('Track failed to download.');
                    } else {
                        if (currentTrack === null) {
                            console.warn('Null track discovered');
                        } else {
                            const [dbPlaylist] = await DBPlaylist.findOrCreate({
                                where: {
                                    playlist: this.id,
                                    source: 'spotify'
                                }
                            });

                            const [track] = await DBTrack.findOrCreate({
                                where: {
                                    track: currentTrack,
                                    source: 'spotify',
                                }
                            });

                            await dbPlaylist.addDBTrack(track);
                        }
                    }
                    setTimeout(process, 50);
                } else {
                    setTimeout(process, 50);
                }
            }

            await process();
        });
    }
}

export default SpotifyPlaylist;
