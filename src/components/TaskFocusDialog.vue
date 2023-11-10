<script setup lang="ts">
import {Dialog, DialogPanel} from '@headlessui/vue';
import {onKeyStroke} from '~/utils/onKeyStroke';
import {storeToRefs} from 'pinia';
import {useTasksStore} from '~/stores';

const {focusedTask, lastSelectedIndex, tasks} = storeToRefs(useTasksStore());
const {focusTask} = useTasksStore();

onKeyStroke(['f', 'F'], () => {
    if (typeof lastSelectedIndex.value === 'number')
        focusTask(tasks.value[lastSelectedIndex.value]);
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
        <DialogPanel class="fixed inset-0 z-1 bg-gray-900 pt-40">
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
