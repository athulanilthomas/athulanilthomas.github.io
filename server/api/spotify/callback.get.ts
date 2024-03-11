import { kv } from '@vercel/kv';

export default defineEventHandler(async (event) => {
    const { code, state, error } = getQuery(event)
    const { spotifyApiClientId, spotifyApiSecret, hostUrl } = useRuntimeConfig()

    const reqBody = new URLSearchParams({
        'code': code as string,
        'redirect_uri': `${hostUrl}/api/spotify/callback`,
        'grant_type': 'authorization_code'
    }).toString()

    // @ts-ignore:next-line
    const { access_token, refresh_token } = await fetch('https://accounts.spotify.com/api/token', {
        method:'post',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization':   'Basic ' + btoa(`${spotifyApiClientId}:${spotifyApiSecret}`)
        },
        body: reqBody
    })

    console.log(code, '\n\n\n', access_token, '\n\n\n', refresh_token)

    kv.set('auth_code', code)
    kv.set('access_token', access_token)
    kv.set('refresh_token', refresh_token)
})