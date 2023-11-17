<script setup lang="ts">
import {breakpointsTailwind, useBreakpoints} from '@vueuse/core';

const breakpoints = useBreakpoints(breakpointsTailwind);

const isSidebarVisible = breakpoints.greaterOrEqual('lg');

const toggleSidebar = function () {
    isSidebarVisible.value = !isSidebarVisible.value;
};

function onClickOutsideSidebar() {
    // If sidebar is visible and screen is smaller than lg, hide the sidebar.
    if (isSidebarVisible.value && breakpoints.smaller('lg').value)
        isSidebarVisible.value = false;
}
</script>

<template>
    <main class="h-screen flex p-1.5">
        <Transition name="slide-right-left">
            <TheSidebar
                v-show="isSidebarVisible"
                v-on-click-outside="onClickOutsideSidebar"
                class="shrink-0"
                @toggle-sidebar="toggleSidebar"
            />
        </Transition>

        <div class="relative min-w-0 grow border border-gray-200/16 rounded-[6px] bg-gray-850">
            <Button
                class="absolute left-1 top-1 z-1 text-gray-400 transition-opacity duration-300"
                :class="isSidebarVisible ? 'opacity-0' : ''"
                size="square"
                variant="ghost"
                @click="toggleSidebar"
            >
                <MaterialSymbolsThumbnailBarOutline />
            </Button>

            <slot />
        </div>

        <TaskCreateDialog />

        <TaskEditDialog />
    </main>
</template>
