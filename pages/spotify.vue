<template>
    <main class="min-h-screen">
      <AppHeader class="mb-12" title="Now Playing" :description="description" />
      <ClientOnly fallback-tag="span" fallback="Loading...">
        <iframe v-if="currentTrack" style="border-radius:12px" :src="currentTrack" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        <UtilEmptyState v-else icon="mdi:sleep" comingSoonText="">
          No tunes to tell, the playlist is paused
        </UtilEmptyState>
     </ClientOnly>
    </main>
  </template>

<script setup>
import { useSpotify } from '~/composables/spotify';

const description = `Tune in to my current jam and discover what songs inspire me 🎵.
Whether it’s rock, pop, jazz, or classical, I love to explore different genres and artists 🎸`

const colorMode = useColorMode();
const { currentTrack } = await useSpotify({ theme: colorMode });

</script>