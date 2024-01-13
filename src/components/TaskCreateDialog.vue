<script setup lang="ts">
import {Dialog, DialogPanel} from '@headlessui/vue';
import {onKeyStroke} from '@vueuse/core';
import {storeToRefs} from 'pinia';
import {useRoute} from 'vue-router';
import {useTasksStore} from '~/stores/tasks';

const route = useRoute();
const routeName = route.name as string;

const {
    draftCreateTask,
    draftCreateTaskHasContent,
    taskCreateDialogIsOpen,
    selectedSubtasks,
} = storeToRefs(useTasksStore());
const {createTask, createSubtask, openTaskCreateDialog} = useTasksStore();

onKeyStroke(['n', 'N'], () => {
    if (taskCreateDialogIsOpen.value === false)
        openTaskCreateDialog(routeName);
}, {dedupe: false});

onKeyStroke(['Enter'], (e) => {
    if (e.metaKey) {
        e.preventDefault();
        createTask();
        if (e.shiftKey)
            close();
    }
});

function close() {
    taskCreateDialogIsOpen.value = false;
}

const hasSubtasks = computed(() => {
    return (Array.isArray(draftCreateTask.value?.subtasks) && draftCreateTask.value!.subtasks.length > 0);
});
</script>

<template>
    <Dialog
        :open="taskCreateDialogIsOpen"
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
                    <div class="px-5 py-4 pb-5">
                        <TaskTitleInput
                            v-model="draftCreateTask.title"
                            @enter="draftCreateTaskHasContent && createTask()"
                        />

                        <TaskNoteInput
                            v-model="draftCreateTask.note"
                            class="mt-4"
                        />
                    </div>

                    <SubtaskList
                        v-model="draftCreateTask.subtasks"
                        v-model:selected-subtasks="selectedSubtasks"
                        class="px-3"
                        :class="{'pb-5': hasSubtasks}"
                    />

                    <div class="flex justify-end gap-2 p-3 pt-0">
                        <TaskButtonMoveTo v-model="draftCreateTask" />

                        <TaskButtonSchedule v-model="draftCreateTask" />

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

                    <div class="flex justify-end gap-2 border-t p-3 pl-5">
                        <Button
                            variant="secondary"
                            @click="close()"
                        >
                            {{ $t('actions.cancel') }}
                        </Button>

                        <Button
                            v-tippy="{
                                content: $t('tooltips.createTask'),
                                placement: 'bottom',
                                offset: [0, 6],
                            }"
                            :disabled="!draftCreateTaskHasContent"
                            variant="primary"
                            @click="createTask()"
                        >
                            {{ $t('actions.createTask') }}
                        </button>
                    </div>
                </div>
            </DialogPanel>
        </div>
    </Dialog>
</template>
