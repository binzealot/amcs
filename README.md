# AMCS - Automated Music Cataloging Service
AMCS (pronounced am-seas) is an open source media cataloging service. It is designed to work with Jellyfin and automatically utilizes freyr to search and organize music.

# Current Features

- Spotify Playlist Indexer
- Automated Sorting

# Current Planned Features

- Spotify Album Indexer
- Deezer support
- Automated Playlist Creation

# Getting Started

## Prerequisites

- A working installation of [freyr](https://github.com/miraclx/freyr-js).
- NodeJS (v22+) and NPM (v10.9+)
- Spotify API App

## Configuration

In the src folder, create a config.json file. This file will be used to provide static information for the scanner to read.
Currently, the file looks like this
```json
{
  "spotify_api": {
    "client_id": "client_id from spotify",
    "client_secret": "client_secret from spotify",
    "redirect_uri": "http://localhost:3000/callback",
    "callback_port": 3000,
    "scope": "playlist-read-private"
  },
  "output": "path to download folder",
  "music": {
    "spotify": {
      "playlists": [
        "playlist id 1",
        "playlist id 2"
      ]
    }
  }
}
```

Note that the redirect URI must match the redirect URI in the Spotify dashboard.
The app will spin up a mini web server to at the port specified. It has 2 paths, /login and /callback.
Navigate in a browser to /login and make sure the redirect URI is set to the same URL you are accessing the site from.
Spotify should handle the login process, this gives you access to all of your playlists including private playlists.
The system will cache any downloads in a sqlite database preventing unnecessary fetching.

## Starting

It is recommended to set up a chron job to run this script on a schedule with some logic to determine if the previous done has completed.

Clone the repository:
```shell
git clone git@github.com:binzealot/amcs.git && cd amcs
```

Install packages:
```shell
npm i
```

Here you should create your config file in the src directory.

Build application
```shell
npm run build
```

Start application
```shell
npm run start
```

The system will automatically scan the config file for any information needed.

## Contribution

If you have suggestions, please open an issue.

If you wish to contribute, please make an issue first, then you can be assigned to that issue.

If you wish to leave a tip, you may do so at the following BTC address:

> bc1q94dm4mktguh4s7nm82g0c330t7djxh65426rhq

