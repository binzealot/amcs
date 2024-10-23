import config from './config.json' with {type: 'json'};
import SpotifyPlaylist from "./media/SpotifyPlaylist.js";
import {access_token} from "./authorize.js";

if (!access_token) {
    console.error("Please provide an API token");
    process.exit(1);
}

// Refresh token

// Main logic
const main = async () => {
    console.log("Starting...");

    const playlists = config.music.spotify.playlists.map(p => new SpotifyPlaylist(p));

    for (let i = 0; i < playlists.length; i++) {
        console.log(`Loading playlist ${i + 1} of ${playlists.length}`);
        await playlists[i].load();
        console.log(`Downloading playlist "${playlists[i].getInfo()?.name}"`);
        await playlists[i].download();
        console.log(`Download complete for playlist "${playlists[i].getInfo()?.name}"`);
    }
}

await main();
