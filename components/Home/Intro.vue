<template>
  <div class="space-y-6">
    <NuxtImg src="/avatar.png" alt="Athul Anil"
      class="ring-2 border ring-gray-200 border-gray-300 dark:ring-white/10 dark:border-gray-800 hover:ring-4 transition-all duration-300 bg-gray-200 dark:bg-gray-900 rounded-full h-12 w-12 sm:h-16 sm:w-16"
      sizes="48px sm:64px" placeholder format="webp" />
    <h1 class="text-xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
      Hello!
    </h1>
    <p class="text-gray-900 dark:text-gray-400">
      I am Athul Anil, a software engineer and developer who lives in Kerala, India. 
      I am passionate about building web applications and sites that are fast, responsive, and elegant. 
      I use Javascript, Nuxt, Vue &amp; Node as my main technologies for developing web solutions that delight users.
    </p>
    <p class="text-gray-900 dark:text-gray-400">
      I lead a double life as a Fullstack Developer. 
      By day, I work at <a href="https://www.capgemini.com/" target="_blank" class="underline">Capgemini</a>, where I create awesome web solutions. 
      By night (and weekends), I switch to a hobbyist mode and explore random tools and apps that I make on my own.
    </p>
  </div>
</template>

<script setup>
useSeoMeta({
  title: "Athul Anil Thomas",
  description:
    "I'm Athul, your friendly neighborhood software engineer from Kerala, India. I specialize in building web applications and sites using Javascript, Nuxt, Vue & Node.",
});
</script>
