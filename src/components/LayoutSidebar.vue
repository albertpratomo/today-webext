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
    <main class="h-screen flex overflow-x-hidden">
        <Button
            class="absolute left-2 top-2 z-10 text-gray-500"
            size="square"
            variant="ghost"
            @click="toggleSidebar"
        >
            <MaterialSymbolsDockToRight />
        </button>

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
