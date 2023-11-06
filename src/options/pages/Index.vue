<script setup lang="ts">
import {useDateFormat, useNow, useWindowSize} from '@vueuse/core';
import {storeToRefs} from 'pinia';
import {useTasksStore} from '~/stores/tasks';

const {tasks, doneTasks, selectedIndexes, taskCreateDialogIsOpen} = storeToRefs(useTasksStore());

const currentDate = useDateFormat(useNow(), 'DD MMM YYYY');

const isCalendarVisible = ref(true);
const isSidebarVisible = ref(true);

const {width} = useWindowSize();
const breakpoint = 1024;

const resizingWindow = function (change: 'increase' | 'decrease' | null) {
    if (width.value < breakpoint) {
        if (isCalendarVisible.value === true)
            isSidebarVisible.value = false;
    }
    else if (change === 'increase') {
        isCalendarVisible.value = true;
        isSidebarVisible.value = true;
    }
};

onMounted(() => {
    resizingWindow(null);
});

watch(width, (newVal, OldVal) => {
    const change = newVal > OldVal ? 'increase' : 'decrease';
    resizingWindow(change);
});

watch(isCalendarVisible, (val) => {
    if (width.value < breakpoint && val === true)
        isSidebarVisible.value = false;
});

watch(isSidebarVisible, (val) => {
    if (width.value < breakpoint && val === true)
        isCalendarVisible.value = false;
});
</script>

<template>
    <LayoutSidebar v-model:is-sidebar-visible="isSidebarVisible">
        <div class="relative h-full flex">
            <button
                class="absolute left-2 top-2 z-10 rounded p-1.5 text-gray-500 hover:bg-gray-800"
                @click="isSidebarVisible = !isSidebarVisible"
            >
                <MaterialSymbolsDockToRight />
            </button>

            <button
                class="absolute right-2 top-2 rounded p-1.5 text-gray-500 hover:bg-gray-800"
                @click="isCalendarVisible = !isCalendarVisible"
            >
                <MaterialSymbolsEventNote />
            </button>

            <div class="flex grow justify-center px-8 pb-3 pt-12 md:px-11">
                <div class="max-w-180 grow">
                    <div class="h-8 flex justify-between">
                        <h1 class="text-xl font-medium">
                            {{ $t('today') }}

                            <span class="ml-1 text-gray-500">
                                {{ currentDate }}
                            </span>
                        </h1>

                        <Button
                            id="btn-new-task"
                            class="text-indigo-400"
                            size="square"
                            :title="$t('newTaskTooltip')"
                            variant="ghost"
                            @click="taskCreateDialogIsOpen = true"
                        >
                            <MaterialSymbolsAdd />
                        </Button>
                    </div>

                    <TaskList
                        v-model="tasks"
                        v-model:done-tasks="doneTasks"
                        v-model:selected-indexes="selectedIndexes"
                        class="mt-8"
                    />
                </div>
            </div>

            <Transition name="slide-left-right">
                <div
                    v-show="isCalendarVisible"
                    class="w-[200px] shrink-0 border-l px-3 pb-3 pt-12 md:w-60"
                >
                    <TimeGridDay />
                </div>
            </Transition>
        </div>
    </LayoutSidebar>
</template>
