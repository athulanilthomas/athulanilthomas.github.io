declare module 'nuxt/schema' {
    interface RuntimeConfig {
        hostUrl: string,
        spotifyApiSecret: string,
        spotifyApiClientId: string
    }
  }
  // It is always important to ensure you import/export something when augmenting a type
  export {}
  