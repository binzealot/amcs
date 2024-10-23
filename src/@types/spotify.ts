type ImageObject = {
    url: string;
    height: number;
    width: number;
}

type SimplifiedArtistObject = {
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    name: string;
    type: "artist";
    uri: string;
}

type SimplifiedTrackObject = {
    album: {
        album_type: "album" | "single" | "compilation";
        total_tracks: number;
        available_markets: string[];
        external_urls: {
            spotify: string;
        };
        href: string;
        id: string;
        images: ImageObject[];
        name: string;
        release_date: string;
        release_date_precision: "year" | "month" | "day";
        restrictions?: {
            reason: "market" | "product" | "explicit";
        };
        type: "album";
        uri: string;
        artists: SimplifiedArtistObject[];
    };
    artists: SimplifiedArtistObject[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: {
        isrc: string;
        ean: string;
        upc: string;
    };
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    is_playable: boolean;
    linked_from: Partial<SimplifiedTrackObject>;
    restrictions: {
        reason: "market" | "product" | "explicit";
    };
    name: string;
    popularity: number;
    preview_url: string | null;
    track_number: number;
    type: "track";
    uri: string;
    is_local: boolean;
};

type SimplifiedEpisodeObject = {
    audio_preview_url: string | null;
    description: string;
    html_description: string;
    duration_ms: number;
    explicit: boolean;
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    images: ImageObject[];
    is_externally_hosted: boolean;
    is_playable: boolean;
    languages: string[];
    name: string;
    release_date: string;
    release_date_precision: "year" | "month" | "day";
    resume_point: {
        fully_played: boolean;
        resume_position_ms: number;
    };
    type: "episode";
    uri: string;
    restrictions: {
        reason: "market" | "product" | "explicit";
    };
    show: {
        available_markets: string[];
        copyrights: {text: string, type: string}[];
        description: string;
        html_description: string;
        explicit: boolean;
        external_urls: {
            spotify: string;
        };
        href: string;
        id: string;
        images: ImageObject[];
        is_externally_hosted: boolean;
        languages: string[];
        media_type: string;
        name: string;
        publisher: string;
        type: "show";
        uri: string;
        total_episodes: number;
    };
};

type PlaylistTrackObject = {
    added_at: string | null;
    added_by: {
        external_urls: {
            spotify: string;
        };
        followers: {
            href: string | null;
            total: number;
        };
        href: string;
        id: string;
        type: "user";
        uri: string;
    } | null;
    is_local: boolean;
    track: SimplifiedTrackObject | SimplifiedEpisodeObject;
}

type PlaylistInfo = {
    collaborative: boolean;
    description: string | null;
    external_urls: {
        spotify: string;
    };
    followers: {
        href: string | null;
        total: number;
    };
    href: string;
    id: string;
    images: ImageObject[];
    name: string;
    owner: {
        external_urls: {
            spotify: string;
        };
        followers: {
            href: string | null;
            total: number;
        };
        href: string;
        id: string;
        type: string;
        uri: string;
        display_name: string | null;
    };
    public: boolean;
    snapshot_id: string;
    tracks: {
        href: string;
        limit: number;
        next: string | null;
        offset: number;
        previous: string | null;
        total: number;
        items: PlaylistTrackObject[];
    };
    type: "playlist";
    uri: string;
}

type PlaylistTracks = {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
    items: PlaylistTrackObject[]
}

export type SpotifyPlaylistInfo = PlaylistInfo;
export type SpotifyTrack = SimplifiedTrackObject;
export type SpotifyEpisode = SimplifiedEpisodeObject;
export type SpotifyPlaylistTracks = PlaylistTracks;
