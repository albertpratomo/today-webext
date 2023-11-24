<script setup lang="ts">
import {Dialog, DialogPanel} from '@headlessui/vue';
import {onKeyStroke} from '~/utils/onKeyStroke';
import {storeToRefs} from 'pinia';
import {useTasksStore} from '~/stores';

const {focusedTask, lastSelectedTaskId} = storeToRefs(useTasksStore());
const {focusTask, taskById} = useTasksStore();

onKeyStroke(['f', 'F'], () => {
    if (typeof lastSelectedTaskId.value === 'number') {
        const taskToFocus = taskById(lastSelectedTaskId.value);
        if (taskToFocus)
            focusTask(taskToFocus);
    }
}, {dedupe: false});

function close() {
    focusedTask.value = null;
}
</script>

<template>
    <Dialog
        :open="!!focusedTask"
        @close="close()"
        @keyup.esc="close()"
    >
        <DialogPanel class="fixed inset-0 bg-gray-900 pt-40">
            <div
                v-if="focusedTask"
                class="mx-auto max-w-xl"
            >
                <TaskTitleInput
                    v-model="focusedTask.title"
                    @keyup.enter="close()"
                />

                <TaskNoteInput
                    v-model="focusedTask.note"
                    class="mt-2"
                />
            </div>
        </DialogPanel>
    </Dialog>
</template>
