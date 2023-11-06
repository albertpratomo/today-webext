<script setup lang="ts">
import {useWindowSize} from '@vueuse/core';

const emit = defineEmits(['isSidebarVisible']);

const isSidebarVisible = ref(true);

const {width} = useWindowSize();
const breakpoint = 1024;

const resizingWindow = function (newWidth: number, oldWidth: number) {
    if (newWidth < breakpoint)
        isSidebarVisible.value = false;

    else if (newWidth > oldWidth)
        isSidebarVisible.value = true;
};

onMounted(() => {
    resizingWindow(width.value, width.value);
});

watch(width, (newWidth, oldWidth) => {
    resizingWindow(newWidth, oldWidth);
});

const toggleSidebar = function () {
    isSidebarVisible.value = !isSidebarVisible.value;
    emit('isSidebarVisible', isSidebarVisible.value);
};
</script>

<template>
    <main class="h-screen flex overflow-x-hidden">
        <button
            class="absolute left-2 top-2 z-10 rounded p-1.5 text-gray-500 hover:bg-gray-800"
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
