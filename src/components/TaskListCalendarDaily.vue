<script setup lang="ts">
import {Dialog, DialogPanel} from '@headlessui/vue';
import {useCalendarStore, useTasksStore} from '~/stores';
import type Task from '~/models/Task';
import {onKeyStroke} from '~/utils/onKeyStroke';
import {storeToRefs} from 'pinia';
import {useRoute} from 'vue-router';

interface Props {
    tasks: Task[]
    doneTasks?: Task[]
    showInfoToggle?: boolean
}

const {tasks, doneTasks = [], showInfoToggle = false} = defineProps<Props>();

const route = useRoute();
const routeName = route.name as string;

const {openTaskCreateDialog} = useTasksStore();

const {calendarIsVisible} = storeToRefs(useCalendarStore());
const infoIsVisible = ref(false);

function toggleCalendar() {
    calendarIsVisible.value = !calendarIsVisible.value;
}

onKeyStroke(['n', 'N'], () => {
    infoIsVisible.value = false;
}, {dedupe: false});

onKeyStroke([']'], () => {
    toggleCalendar();
});
</script>

<template>
    <div class="relative h-full min-w-0 flex">
        <Button
            v-tippy="{
                content: $t('tooltips.toggleCalendarDaily'),
                placement: 'left',
                offset: [0, 6],
            }"
            class="absolute right-1 top-1 z-10 text-gray-500"
            size="square"
            variant="ghost"
            @click="toggleCalendar"
        >
            <MaterialSymbolsCalendarTodayOutline />
        </Button>

        <div class="min-w-0 flex grow justify-center overflow-y-auto px-8 py-10 md:px-11">
            <div class="max-w-[960px] min-w-0 grow">
                <div class="group h-8 flex justify-between">
                    <div class="flex gap-2">
                        <h1 class="text-xl font-medium">
                            <slot name="header" />
                        </h1>

                        <button
                            v-if="showInfoToggle"
                            class="mb-1 opacity-0 group-hover:opacity-100"
                            @click="infoIsVisible = true"
                        >
                            <MaterialSymbolsInfoOutline class="h-4 w-4 text-gray-500" />
                        </button>
                    </div>

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
                        @click="openTaskCreateDialog(routeName)"
                    >
                        <MaterialSymbolsAdd />
                    </Button>
                </div>

                <slot
                    v-if="tasks.length === 0"
                    name="empty-state"
                />

                <TaskList
                    v-show="tasks.length || doneTasks.length"
                    class="mt-8 pb-10"
                    :done-tasks="doneTasks"
                    :tasks="tasks"
                />
            </div>
        </div>

        <Transition name="slide-left-right">
            <div
                v-show="calendarIsVisible"
                class="shrink-0 border-l border-gray-750 p-2.5"
                w="70 xl:80"
            >
                <CalendarDaily />
            </div>
        </Transition>
    </div>

    <Dialog
        v-if="showInfoToggle"
        :open="infoIsVisible"
        @close="infoIsVisible = false"
    >
        <div class="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel class="relative">
                <TaskListEmptyState
                    :bucket="routeName"
                    :is-closeable="true"
                    @close="infoIsVisible = false"
                />
            </DialogPanel>
        </div>
    </Dialog>
</template>
