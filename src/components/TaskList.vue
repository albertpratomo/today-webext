<script setup lang="ts">
import type Task from '~/models/Task';
import {onKeyStroke} from '@vueuse/core';

const tasks = defineModel<Task[]>({required: true});
const selectedIndexes = defineModel<number[]>('selectedIndexes', {required: true});

function onTaskEnter(task: Task, index: number) {

}

function onTaskClick(clicked: number, {ctrlKey, metaKey, shiftKey}: PointerEvent) {
    if (ctrlKey || metaKey) {
        // Select or deselect the task.
        selectedIndexes.value.includes(clicked)
            ? selectedIndexes.value.splice(selectedIndexes.value.indexOf(clicked), 1)
            : selectedIndexes.value.push(clicked);
    }
    else if (selectedIndexes.value.length && shiftKey) {
        const lastIndex = selectedIndexes.value[selectedIndexes.value.length - 1];

        selectedIndexes.value = Array.from(new Set([
            ...selectedIndexes.value,
            ...Array.from(
                {length: Math.abs(clicked - lastIndex) + 1},
                (_, i) => Math.min(clicked, lastIndex) + i,
            ),
        ]));
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
