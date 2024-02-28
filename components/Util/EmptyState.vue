<template>
    <div class="container flex flex-wrap justify-between items-center mx-auto rounded-md">
        <div class="text-center border-dashed border-2 border-gray-300 dark:border-gray-100 rounded-md w-full p-10">
            <Icon v-if="icon" aria-hidden="true" :name="icon" class="w-8 h-8 z-10 bx bxs-contact bx-lg mb-3 dark:text-white" />
            <p class="text-xl mb-2 capitalize font-bold tracking-normal text-zinc-800 dark:text-zinc-100">
                <slot />
            </p>
            <span v-if="comingSoonText" class="mt-6 text-sm text-gray-600 dark:text-gray-400">{{ comingSoonText }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
type Props = {
    icon: string,
    comingSoonText?: string
}

const props = withDefaults(defineProps<Props>(), {
    comingSoonText: `There's nothing to see here yet. But we promise, it will be worth the wait`
})

const { icon, comingSoonText } = toRefs(props)
</script>