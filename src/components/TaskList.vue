<script setup lang="ts">
import type Task from '~/models/Task';
import {onKeyStroke} from '@vueuse/core';

const tasks = defineModel<Task[]>({required: true});
const selectedIndexes = defineModel<number[]>('selectedIndexes', {required: true});

function onTaskEnter(task: Task, index: number) {

}

function onTaskClick(clicked: number, {ctrlKey, metaKey}: PointerEvent) {
    if (ctrlKey || metaKey) {
        const index = selectedIndexes.value.indexOf(clicked);

        // Deselect if the clicked task is already selected.
        if (index !== -1) {
            selectedIndexes.value.splice(index, 1);
        }
        else {
            selectedIndexes.value.push(clicked);
            selectedIndexes.value.sort((a, b) => a - b); // Keep the array sorted
        }
    }
    else {
        // Replace the whole selection.
        selectedIndexes.value = [clicked];
    }
}

onKeyStroke('ArrowUp', (event) => {
    event.preventDefault();
});

onKeyStroke('ArrowDown', (event) => {
    event.preventDefault();
});

const onClickOutside = [
    () => selectedIndexes.value = [],
    // Don't deselect when user click on these elements, so user can insert task
    // under the selected position.
    {ignore: ['#btn-new-task', '#headlessui-portal-root']},
];
</script>

<template>
    <div v-on-click-outside="onClickOutside">
        <TaskItem
            v-for="(task, i) in tasks"
            :key="i"
            v-model="tasks[i]"
            :aria-selected="selectedIndexes.includes(i)"
            @click="onTaskClick(i, $event)"
            @keyup.enter="onTaskEnter(task, i)"
        />
    </div>
</template>

<style scoped>
:deep([aria-selected="true"]) {
    @apply bg-indigo-900;
}
</style>
