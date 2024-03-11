<template>
    <main class="min-h-screen">
      <AppHeader class="mb-12" title="Now Playing" :description="description" />
      <iframe style="border-radius:12px" :src="currentTrack" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
    </main>
  </template>

<script setup>
import { useSpotify } from '~/composables/spotify';

const description = `Tune in to my current jam and discover what songs inspire me 🎵.
Whether it’s rock, pop, jazz, or classical, I love to explore different genres and artists 🎸`

const { currentTrack } = await useSpotify()

</script>