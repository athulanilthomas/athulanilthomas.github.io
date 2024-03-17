import { watchEffect } from 'vue'
import { withQuery } from 'ufo'


interface UseSpotifyOptions {
    theme?: { value: 'dark' | 'light' }
}

export async function useSpotify(options?: UseSpotifyOptions) {
    const response = await $fetch<{ item: { id: string | null } }>('/api/spotify/status')
    let url = ref('')

    const handler = () => {
        const trackId = response?.item?.id;
        if(trackId) {
            url.value = withQuery(`https://open.spotify.com/embed/track/${trackId}?utm_source=generator`, {
                theme: { 'dark': 0, 'light': 1 }[options?.theme?.value ?? 'dark']
            })
        }
    }

    watchEffect(handler)

    return { currentTrack: url ?? null }
}