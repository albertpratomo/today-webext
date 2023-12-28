<script setup lang="ts">
import {Dialog, DialogPanel} from '@headlessui/vue';
import {useCalendarStore, useTasksStore} from '~/stores';
import type Task from '~/models/Task';
import {onKeyStroke} from '~/utils/onKeyStroke';
import {storeToRefs} from 'pinia';
import {useRoute} from 'vue-router';

withDefaults(
    defineProps<{
        toggleEmptyStateInfo?: boolean
    }>(),
    {
        toggleEmptyStateInfo: false,
    },
);

const route = useRoute();
const routeName = route.name as string;

const {openTaskCreateDialog} = useTasksStore();

const tasks = defineModel<Task[]>({required: true});
const doneTasks = defineModel<Task[]>('doneTasks', {local: true, default: []});

const {isCalendarVisible} = storeToRefs(useCalendarStore());
const isEmptyStateInfoVisible = ref(false);

function toggleCalendar() {
    isCalendarVisible.value = !isCalendarVisible.value;
}

onKeyStroke(['n', 'N'], () => {
    isEmptyStateInfoVisible.value = false;
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
                            v-if="toggleEmptyStateInfo"
                            class="opacity-0 group-hover:opacity-100"
                            @click="isEmptyStateInfoVisible = true"
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

    <Dialog
        v-if="toggleEmptyStateInfo"
        :open="isEmptyStateInfoVisible"
        @close="isEmptyStateInfoVisible = false"
    >
        <div class="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel class="relative">
                <TaskListEmptyState
                    :bucket="routeName"
                    :is-closeable="true"
                    @close="isEmptyStateInfoVisible = false"
                />
            </DialogPanel>
        </div>
    </Dialog>
</template>
