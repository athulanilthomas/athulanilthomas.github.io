declare module 'nuxt/schema' {
    interface RuntimeConfig {
        hostUrl: string,
        spotifyClientId: string
    }
  }
  // It is always important to ensure you import/export something when augmenting a type
  export {}
  