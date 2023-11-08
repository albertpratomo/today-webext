<script setup lang="ts">
import {breakpointsTailwind, useBreakpoints} from '@vueuse/core';

const breakpoints = useBreakpoints(breakpointsTailwind);

const isSidebarVisible = ref(breakpoints.greaterOrEqual('lg'));

const toggleSidebar = function () {
    isSidebarVisible.value = !isSidebarVisible.value;
};
</script>

<template>
    <main class="h-screen flex overflow-x-hidden p-1.5">
        <Transition name="slide-right-left">
            <TheSidebar
                v-show="isSidebarVisible"
                class="shrink-0"
                @toggle-sidebar="toggleSidebar"
            />
        </Transition>

        <div class="relative grow border border-gray-200/16 rounded-[7px] bg-gray-850">
            <Button
                class="absolute left-1 top-1 z-1 text-gray-400 transition-opacity duration-300"
                :class="isSidebarVisible ? 'opacity-0' : ''"
                size="square"
                variant="ghost"
                @click="toggleSidebar"
            >
                <MaterialSymbolsThumbnailBarOutline />
            </button>

            <slot />
        </div>

        <TaskCreateDialog />

        <TaskEditDialog />
    </main>
</template>
