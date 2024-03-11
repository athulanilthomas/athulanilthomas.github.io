import { watchEffect } from 'vue'
import { withQuery } from 'ufo'

interface UseSpotifyOptions {
    theme: 'light' | 'dark'
}

export async function useSpotify(options?: MaybeRef<UseSpotifyOptions>) {
    const response = await $fetch('/api/spotify/status')
    let url = ref('')

    const handler = () => {
        const theme = toValue(options ?? { theme: 'dark' }).theme
        if(response?.item?.id) {
            let { item: { id } = {} } = response ?? {}
            url.value = withQuery(`https://open.spotify.com/embed/track/${id}?utm_source=generator`, {
                theme: { 'dark': 0, 'light': 1 }[theme]
            })
        }
    }

    watchEffect(handler)

    return { currentTrack: url ?? null }
}