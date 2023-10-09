<script setup lang="ts">
import {Dialog, DialogPanel} from '@headlessui/vue';
import {useHistoryStore, useTasksStore} from '~/stores';
import {onKeyStroke} from '~/utils/onKeyStroke';
import {storeToRefs} from 'pinia';

const {draftEditTask, selectedSubtasks} = storeToRefs(useTasksStore());
const {createSubtask} = useTasksStore();

const titleComponent = ref(null);

function close() {
    draftEditTask.value = null;

    useHistoryStore().commit();
}

function focusTitleInput() {
    titleComponent.value.editor.commands.focus();
}

function hasSubtasks() {
    return (typeof draftEditTask.value?.subtasks != 'undefined' && draftEditTask.value.subtasks.length > 0);
}

function focusFirstSubtask() {
    if (!hasSubtasks())
        createSubtask();
    else
        selectedSubtasks.value = [0];
}

function createFirstSubtask() {
    if (!hasSubtasks())
        createSubtask();
}

onKeyStroke(['0'], ({metaKey, shiftKey}) => {
    if (metaKey && shiftKey)
        createFirstSubtask();
});
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
                    <div
                        v-if="draftEditTask"
                        class="py-4 pl-5 pr-2"
                    >
                        <TaskTitleInput
                            ref="titleComponent"
                            v-model="draftEditTask.title"
                            @keyboard-arrow-down="focusFirstSubtask()"
                            @keyboard-shift-meta-0="createFirstSubtask()"
                            @keyup.enter="close()"
                        />

                        <TaskNoteInput
                            v-model="draftEditTask.note"
                            class="mt-2"
                        />

                        <div
                            v-if="!hasSubtasks()"
                            class="mt-5 flex justify-end gap-2"
                        >
                            <button
                                id="btn-new-task"
                                class="bg-gray-800 btn-icon"
                                :title="$t('createSubtaskTooltip')"
                                @click="createFirstSubtask()"
                            >
                                <MaterialSymbolsChecklist />
                            </button>
                        </div>

                        <SubtaskList
                            v-model="draftEditTask.subtasks"
                            v-model:selected-subtasks="selectedSubtasks"
                            @event-empty-list="focusTitleInput()"
                        />
                    </div>
                </div>
            </DialogPanel>
        </div>
    </Dialog>
</template>
