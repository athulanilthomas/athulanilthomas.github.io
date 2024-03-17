export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  modules: [
    "@nuxt/ui",
    "nuxt-icon",
    "@nuxtjs/google-fonts",
    "@nuxtjs/fontaine",
    "@nuxt/image",
    "@nuxt/content",
    "@nuxthq/studio",
    "@vueuse/nuxt"
  ],
  experimental: {
    componentIslands: true,
  },
  routeRules: {
    '/**': { prerender: true },
    '/api/**': { cors: true },
    '/spotify': { ssr: true },
  },
  nitro: {
    storage: {
      db: { driver: 'vercelKV' }
    }
  },
  runtimeConfig: {
    baseUrl: '',
    spotifyClientId: ''
  },
  ui: {
    icons: ["heroicons", "lucide"],
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      htmlAttrs: {
        lang: "en",
        class: "h-full",
      },
      bodyAttrs: {
        class: "antialiased bg-gray-50 dark:bg-black min-h-screen",
      },
    },
  },
  content: {
    highlight: {
      theme: "github-dark",
    },
    ignores: [
      '/articles/',
      '/projects/'
    ]
  },
  googleFonts: {
    display: "swap",
    families: {
      Inter: [400, 500, 600, 700, 800, 900],
    },
  },
});