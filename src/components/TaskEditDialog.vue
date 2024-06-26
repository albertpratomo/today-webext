<script setup lang="ts">
import {Dialog, DialogPanel} from '@headlessui/vue';
import {useHistoryStore, useTasksStore} from '~/stores';
import {storeToRefs} from 'pinia';

const {draftEditTask, selectedSubtasks} = storeToRefs(useTasksStore());
const {createSubtask} = useTasksStore();

function close() {
    draftEditTask.value = null;

    useHistoryStore().commit();
}

const hasSubtasks = computed(() => {
    return (Array.isArray(draftEditTask.value?.subtasks) && draftEditTask.value!.subtasks.length > 0);
});
</script>

<template>
    <Dialog
        v-if="!!draftEditTask"
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
                        class="px-5 py-4 pb-5"
                    >
                        <TaskTitleInput
                            v-model="draftEditTask.title"
                            :is-focused="!hasSubtasks"
                            @keyup.enter="close()"
                        />

                        <TaskNoteInput
                            v-model="draftEditTask.note"
                            class="mt-4"
                        />
                    </div>

                    <SubtaskList
                        v-model="draftEditTask.subtasks"
                        v-model:selected-subtasks="selectedSubtasks"
                        class="px-3"
                        :class="{'pb-5': hasSubtasks}"
                    />

                    <div class="flex justify-end gap-2 p-3 pt-0">
                        <TaskButtonMoveTo v-model="draftEditTask" />

                        <TaskButtonSchedule v-model="draftEditTask" />

                        <Button
                            v-if="!hasSubtasks"
                            v-tippy="{
                                content: $t('tooltips.addSubtasks'),
                                placement: 'bottom',
                                offset: [0, 6],
                            }"
                            size="xs"
                            variant="secondary"
                            @click="createSubtask"
                        >
                            <MaterialSymbolsChecklist class="h-4 w-4 text-gray-350" />
                        </Button>
                    </div>
                </div>
            </DialogPanel>
        </div>
    </Dialog>
</template>
