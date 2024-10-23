import * as crypto from "node:crypto";
import config from './config.json' with {type: 'json'};
import express from 'express';
import * as querystring from "node:querystring";
import {AuthData} from "./database/sequelize.js";

const app = express();

const spotify = await AuthData.findOne({where: {type: 'spotify'}});
let token: string | null = null;

if (spotify === null) {
    console.log('Login required');
    app.get('/login', (req, res) => {
        const state = crypto.randomBytes(8).toString('hex');

        res.redirect('https://accounts.spotify.com/authorize?' + querystring.stringify({
            response_type: 'code',
            client_id: config.spotify_api.client_id,
            scope: config.spotify_api.scope,
            redirect_uri: config.spotify_api.redirect_uri,
            state: state
        }));
    });

    app.get('/callback', async (req, res) => {
        const code = req.query.code as string;

        // Retrieve access code
        const body = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(config.spotify_api.client_id + ':' + config.spotify_api.client_secret).toString('base64')
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                redirect_uri: config.spotify_api.redirect_uri,
                code: code
            })
        }).then(res => res.json());

        console.log(body);

        await AuthData.create({
            type: 'spotify',
            access_token: body.access_token,
            refresh_token: body.refresh_token,
        });

        res.status(200).send("You may now close this window.");
    });

    app.listen(config.spotify_api.callback_port, () => {
        console.log(config.spotify_api.redirect_uri);
    });

    const wait = () => {
        const check = async (resolve: (value?: unknown) => void) => {
            const spotify = await AuthData.findOne({where: {type: 'spotify'}});
            if (spotify !== null) resolve();
            setTimeout(() => check(resolve), 100);
        }

        return new Promise((resolve) => {
            setTimeout(() => check(resolve), 100);
        });
    }

    await wait();

    token = (await AuthData.findOne({where: {type: 'spotify'}}))?.access_token ?? null;
} else {
    const {access_token, refresh_token} = spotify;

    const res = await fetch('https://api.spotify.com/v1/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${access_token}`,
        }
    });

    if (res.status === 200) {
        console.log('Authentication Successful');
        token = access_token;
    } else {
        console.log('Refresh required');
        const res = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(config.spotify_api.client_id + ':' + config.spotify_api.client_secret).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            })
        });

        if (res.status === 200) {
            console.log('Token updated successfully');
            const json = await res.json();
            await spotify.update({
                access_token: json.access_token,
                refresh_token: json.refresh_token,
            });

            token = json.access_token;
        } else {
            console.error('Failed to refresh token. Please restart application.');
            await spotify.destroy();
            process.exit(1);
        }
    }
}

export const access_token = token;
