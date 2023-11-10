<script setup lang="ts">
import {Dialog, DialogPanel} from '@headlessui/vue';
import {onKeyStroke} from '~/utils/onKeyStroke';
import {storeToRefs} from 'pinia';
import {useTasksStore} from '~/stores/tasks';

const {
    draftCreateTask,
    draftCreateTaskHasContent,
    taskCreateDialogIsOpen,
    selectedSubtasks,
} = storeToRefs(useTasksStore());
const {createTask, createSubtask} = useTasksStore();

onKeyStroke(['n', 'N'], () => {
    taskCreateDialogIsOpen.value = true;
}, {dedupe: false});

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

        <div class="fixed inset-0 z-1 flex items-center justify-center p-4">
            <DialogPanel class="max-w-xl w-full">
                <div class="border rounded bg-gray-800 text-gray-100">
                    <div class="px-5 py-4 pb-5">
                        <TaskTitleInput
                            v-model="draftCreateTask.title"
                            @keyup.enter="() => draftCreateTaskHasContent ? createTask() : close()"
                        />

                        <TaskNoteInput
                            v-model="draftCreateTask.note"
                            class="mt-4"
                        />
                    </div>

                    <div
                        v-if="!hasSubtasks"
                        class="flex justify-end gap-2 px-3"
                    >
                        <button
                            class="border-gray-600 bg-gray-750 btn-icon"
                            :title="$t('createSubtaskTooltip')"
                            @click="createSubtask"
                        >
                            <MaterialSymbolsChecklist class="h-4 w-4 text-gray-350" />
                        </button>
                    </div>

                    <SubtaskList
                        v-model="draftCreateTask.subtasks"
                        v-model:selected-subtasks="selectedSubtasks"
                        class="px-3"
                        :class="[hasSubtasks ? 'pb-5' : 'pb-3']"
                    />

                    <div class="flex justify-end gap-2 border-t p-3 pl-5">
                        <Button
                            variant="secondary"
                            @click="close()"
                        >
                            {{ $t('actions.cancel') }}
                        </Button>

                        <Button
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
