<script setup lang="ts">
import {useWindowSize} from '@vueuse/core';

const emit = defineEmits(['sidebarToggle']);

const isSidebarVisible = ref(true);

const {width} = useWindowSize();
const breakpoint = 1024;

const onWindowResized = function (newWidth: number, oldWidth: number) {
    if (newWidth < breakpoint)
        isSidebarVisible.value = false;

    else if (newWidth > oldWidth)
        isSidebarVisible.value = true;
};

onMounted(() => {
    onWindowResized(width.value, width.value);
});

watch(width, (newWidth, oldWidth) => {
    onWindowResized(newWidth, oldWidth);
});

const toggleSidebar = function () {
    isSidebarVisible.value = !isSidebarVisible.value;
    emit('sidebarToggle', isSidebarVisible.value);
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
                class="absolute left-1 top-1 z-10 text-gray-400 transition-opacity duration-300"
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
