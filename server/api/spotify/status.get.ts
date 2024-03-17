// Essentials
import { SpotifyApi as Spotify } from '@spotify/web-api-ts-sdk'
import { AuthorizationCodeWithPKCEStrategyOnNode } from '@/server/utils/spotify'
import { VercelKVCachingStrategy } from '~/server/utils/cache'
import { Scopes } from '~/server/utils/helpers'

export default defineLazyEventHandler(() => {
  const { baseUrl, spotifyClientId } = useRuntimeConfig()
  const redirectUri = `${baseUrl}/api/spotify/callback`

  const strategy = new AuthorizationCodeWithPKCEStrategyOnNode(
    spotifyClientId,
    redirectUri,
    Scopes
  )

  const sdk = new Spotify(strategy, {
    cachingStrategy: new VercelKVCachingStrategy()
  })

  return defineEventHandler(async (event) => {
    const playbackState = await sdk.player.getCurrentlyPlayingTrack()
    return { item: { id: playbackState?.item?.id ?? null } }
  })
})