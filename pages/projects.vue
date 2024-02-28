<template>
  <main class="min-h-screen">
    <AppHeader class="mb-12" title="Projects" :description="description" />
    <div v-if="projects.length" class="space-y-4">
      <AppProjectCard
        v-for="(project, id) in projects"
        :key="id"
        :project="project"
      />
    </div>
    <UtilEmptyState v-else icon="mdi:database-off-outline">
      No Projects
    </UtilEmptyState>
  </main>
</template>

<script setup>
const description =
  "I have explored various frameworks by crafting mini-projects of my own. Some of them turned out to be handy tools for my daily tasks. Here are a few examples of what I made";
useSeoMeta({
  title: "Projects | Athul Anil Thomas",
  description,
});

const { data: projects } = await useAsyncData("projects-all", () =>
  queryContent("/projects").find()
);
</script>
