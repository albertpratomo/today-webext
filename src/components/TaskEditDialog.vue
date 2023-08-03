<script setup lang="ts">
import {Dialog, DialogPanel} from '@headlessui/vue';
import {storeToRefs} from 'pinia';
import {useTasksStore} from '~/stores/tasks';

const {draftEditTask} = storeToRefs(useTasksStore());
const {editTask} = useTasksStore();

function close() {
    draftEditTask.value = null;
}
</script>

<template>
    <Dialog
        :open="!!draftEditTask"
        @close="close()"
        @keyup.esc="close()"
    >
        <div
            aria-hidden="true"
            class="fixed inset-0 bg-black/30"
        />

        <div class="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel class="max-w-xl w-full">
                <div class="border rounded bg-gray-800 text-gray-100">
                    <div class="py-4 pl-5 pr-2">
                        <TaskTitleInput
                            v-model="draftEditTask.title"
                            @keyup.enter="close()"
                        />

                        <TaskNoteInput
                            v-model="draftEditTask.note"
                            class="mt-2"
                        />

                        <div class="mt-5 flex justify-end gap-2">
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
                            @click="close()"
                        >
                            {{ $t('actions.cancel') }}
                        </button>

                        <button
                            class="btn-indigo"
                            @click="close()"
                        >
                            {{ $t('actions.saveTask') }}
                        </button>
                    </div>
                </div>
            </DialogPanel>
        </div>
    </Dialog>
</template>
