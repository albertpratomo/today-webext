<script setup lang="ts">
import {useDateFormat, useNow} from '@vueuse/core';
import {storeToRefs} from 'pinia';
import {useTasksStore} from '~/stores/tasks';

const {tasks, doneTasks, selectedIndexes, taskCreateDialogIsOpen} = storeToRefs(useTasksStore());

const currentDate = useDateFormat(useNow(), 'DD MMM YYYY');

const isCalendarVisible = ref(true);
</script>

<template>
    <LayoutSidebar>
        <div class="relative h-full flex">
            <Button
                class="absolute right-2 top-2 z-1 text-gray-500"
                size="square"
                variant="ghost"
                @click="isCalendarVisible = !isCalendarVisible"
            >
                <MaterialSymbolsCalendarTodayOutline />
            </Button>

            <div class="flex grow justify-center px-8 pb-3 pt-10 md:px-11">
                <div class="max-w-[960px] grow">
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
                    class="shrink-0 border-l border-gray-750 p-3 pt-4"
                    w="70 xl:80"
                >
                    <CalendarDaily />
                </div>
            </Transition>
        </div>
    </LayoutSidebar>
</template>
