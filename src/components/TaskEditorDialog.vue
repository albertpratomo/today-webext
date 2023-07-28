<script setup lang="ts">
import {Dialog, DialogPanel} from '@headlessui/vue';
import type Task from '~/models/Task';
import {onKeyStroke} from '@vueuse/core';
import {useTasksStore} from '~/stores/tasks';

const task = ref<Task>({title: 'a', isDone: false});

const isOpen = ref(true);

const {newTask} = useTasksStore();
onKeyStroke(['n', 'N'], (e) => {
    if (e.target instanceof HTMLElement && !e.target.isContentEditable) {
        newTask();
        isOpen.value = true;
    }
}, {eventName: 'keyup'});
</script>

<template>
    <Dialog
        :open="isOpen"
        @close="isOpen = false"
    >
        <div class="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel class="max-w-lg w-full">
                <TaskEditor v-model="task" />
            </DialogPanel>
        </div>
    </Dialog>
</template>
