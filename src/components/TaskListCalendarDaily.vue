<script setup lang="ts">
import type Task from '~/models/Task';
import {onKeyStroke} from '~/utils/onKeyStroke';
import {storeToRefs} from 'pinia';
import {useTasksStore} from '~/stores';

const {taskCreateDialogIsOpen} = storeToRefs(useTasksStore());

const tasks = defineModel<Task[]>({required: true});
const doneTasks = defineModel<Task[]>('doneTasks', {local: true, default: []});

const isCalendarVisible = ref(true);

function toggleCalendar() {
    isCalendarVisible.value = !isCalendarVisible.value;
}

onKeyStroke([']'], () => {
    toggleCalendar();
});
</script>

<template>
    <div class="relative h-full min-w-0 flex">
        <Button
            class="absolute right-1 top-1 z-10 text-gray-500"
            size="square"
            variant="ghost"
            @click="toggleCalendar"
        >
            <MaterialSymbolsCalendarTodayOutline />
        </Button>

        <div class="min-w-0 flex grow justify-center overflow-y-auto px-8 py-10 md:px-11">
            <div class="max-w-[960px] min-w-0 grow">
                <div class="h-8 flex justify-between">
                    <h1 class="text-xl font-medium">
                        <slot name="header" />
                    </h1>

                    <Button
                        id="btn-new-task"
                        v-tippy="{
                            content: $t('tooltips.newTask'),
                            placement: 'bottom',
                            offset: [0, 6],
                        }"
                        class="text-indigo-400"
                        size="square"
                        variant="ghost"
                        @click="taskCreateDialogIsOpen = true"
                    >
                        <MaterialSymbolsAdd />
                    </Button>
                </div>

                <TaskList
                    v-model="tasks"
                    v-model:done-tasks="doneTasks"
                    class="mt-8 pb-10"
                />
            </div>
        </div>

        <Transition name="slide-left-right">
            <div
                v-show="isCalendarVisible"
                class="shrink-0 border-l border-gray-750 p-2.5"
                w="70 xl:80"
            >
                <CalendarDaily />
            </div>
        </Transition>
    </div>
</template>
