import type { SpotifyResponse } from '@/types/spotify'

export default defineSpotifyReponseHandler(async (event) => {
    const { spotifyApiSecret } = useRuntimeConfig()

    const result = await $fetch<SpotifyResponse>('https://api.spotify.com/v1/me/player', {
      headers: {
        Authorization: `Bearer ${spotifyApiSecret}`
      }
    })

    return { item: { id: result?.item?.id ?? null } }
})