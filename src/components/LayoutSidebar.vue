<script setup lang="ts">
const isSidebarVisible = defineModel<boolean>('isSidebarVisible', {required: true});
</script>

<template>
    <main class="h-screen flex overflow-x-hidden">
        <Transition name="slide-right-left">
            <TheSidebar
                v-show="isSidebarVisible"
                class="shrink-0 border-r"
            />
        </Transition>

        <div class="grow bg-gray-850">
            <slot />
        </div>

        <TaskCreateDialog />

        <TaskEditDialog />
    </main>
</template>
