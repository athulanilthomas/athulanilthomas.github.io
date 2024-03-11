import { withQuery } from 'ufo'
import { kv } from '@vercel/kv';

import type { RuntimeConfig } from 'nuxt/schema';
import type { EventHandler, EventHandlerRequest } from 'h3'

const generateRandomString = (length: number) => {
    return crypto.randomUUID().slice(0, length)
}

const getSpotifyToken = (props: { client_id: string, redirect_uri: string }) => {
    const url = withQuery('https://accounts.spotify.com/authorize', {
        response_type: 'code',
        client_id: props.client_id,
        scope: 'user-read-private user-read-email',
        redirect_uri: props.redirect_uri,
    })
    return fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

const getAccessToken = async (config: RuntimeConfig) => {
    const accessTokenObj = { value: await kv.get('access_token') }

    // if(!accessTokenObj.value) {
        const refresh_token = await kv.get('refresh_token')
        await getSpotifyToken({
            client_id: config.spotifyApiClientId,
            redirect_uri: config.hostUrl + '/api/spotify/callback'
        })
    // }

    return await kv.get('access_token')
}

export const defineSpotifyReponseHandler = <T extends EventHandlerRequest, D>(
    handler: EventHandler<T, D>
): EventHandler<T, D> => defineEventHandler<T>(async event => {
    try {
        const config = useRuntimeConfig()
        const accessToken = await getAccessToken(config)

        console.log(accessToken)

        // Do something before handler
        return await handler(event)
    }
    catch(error) {
        
    }
  })