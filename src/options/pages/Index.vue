<script setup lang="ts">
import {useDateFormat, useNow} from '@vueuse/core';
import {onKeyStroke} from '~/utils/onKeyStroke';
import {storeToRefs} from 'pinia';
import {useTasksStore} from '~/stores/tasks';

const {tasks, doneTasks, selectedIndexes, taskCreateDialogIsOpen} = storeToRefs(useTasksStore());

const currentDate = useDateFormat(useNow(), 'DD MMM YYYY');

const isCalendarVisible = ref(true);

function toggleCalendar() {
    isCalendarVisible.value = !isCalendarVisible.value;
}

onKeyStroke([']'], () => {
    toggleCalendar();
});
</script>

<template>
    <LayoutSidebar>
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
                            {{ $t('sidebar.today') }}

                            <span class="ml-1 text-gray-500">
                                {{ currentDate }}
                            </span>
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
                        v-model:selected-indexes="selectedIndexes"
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
    </LayoutSidebar>
</template>
