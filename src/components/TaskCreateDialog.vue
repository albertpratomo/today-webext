<script setup lang="ts">
import {Dialog, DialogPanel} from '@headlessui/vue';
import {onKeyUp} from '@vueuse/core';
import {storeToRefs} from 'pinia';
import {useTasksStore} from '~/stores/tasks';

const {draftCreateTask} = storeToRefs(useTasksStore());
const {createTask} = useTasksStore();

const isOpen = ref(false);

onKeyUp(['n', 'N'], (e) => {
    if (e.target instanceof HTMLElement && !e.target.isContentEditable)
        isOpen.value = true;
});
</script>

<template>
    <Dialog
        :open="isOpen"
        @close="isOpen = false"
    >
        <div class="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel class="max-w-xl w-full">
                <div class="border rounded bg-gray-800 text-gray-100">
                    <div class="py-4 pl-5 pr-2">
                        <TaskTitleInput
                            v-model="draftCreateTask.title"
                            @keyup.enter="createTask()"
                        />

                        <TaskNoteInput
                            v-model="draftCreateTask.note"
                            class="mt-2"
                        />

                        <div class="mt-2 flex justify-end gap-2">
                            <button class="btn-icon">
                                <MaterialSymbolsStarRounded />
                            </button>

                            <button class="btn-icon">
                                <MaterialSymbolsScheduleOutline />
                            </button>
                        </div>
                    </div>

                    <div class="flex justify-end gap-2 border-t p-2 pl-5">
                        <button
                            class="btn-gray"
                            @click="isOpen = false"
                        >
                            {{ $t('actions.cancel') }}
                        </button>

                        <button
                            class="btn-indigo"
                            @click="createTask()"
                        >
                            {{ $t('actions.addTask') }}
                        </button>
                    </div>
                </div>
            </DialogPanel>
        </div>
    </Dialog>
</template>