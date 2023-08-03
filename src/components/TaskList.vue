<script setup lang="ts">
import type Task from '~/models/Task';
import {onKeyStroke} from '~/utils/onKeyStroke';
import {useTasksStore} from '~/stores/tasks';

const tasks = defineModel<Task[]>({required: true});
const selectedIndexes = defineModel<number[]>('selectedIndexes', {required: true});

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

const onClickOutside = [
    () => selectedIndexes.value = [],
    // Don't deselect when user click on these elements, so user can insert task
    // under the selected position.
    {ignore: ['#btn-new-task', '#headlessui-portal-root']},
];

onKeyStroke(['ArrowDown', 'ArrowUp'], (e) => {
    e.preventDefault();

    const taskLength = tasks.value.length;
    const isArrowDown = e.key === 'ArrowDown';

    const lastIndex = selectedIndexes.value.at(-1) ?? (isArrowDown ? -1 : 0);
    const selected = (lastIndex + (isArrowDown ? 1 : -1) + taskLength) % taskLength;

    if (e.shiftKey) {
        if (selectedIndexes.value.includes(selected))
            selectedIndexes.value = selectedIndexes.value.filter(i => i !== lastIndex);
        else
            selectedIndexes.value.push(selected);
    }
    else { selectedIndexes.value = [selected]; }
});

onKeyStroke(['Esc', 'Escape'], () => {
    selectedIndexes.value = [];
});

const {editTask} = useTasksStore();
</script>

<template>
    <div v-on-click-outside="onClickOutside">
        <TaskItem
            v-for="(task, i) in tasks"
            :key="i"
            v-model="tasks[i]"
            :aria-selected="selectedIndexes.includes(i)"
            @click="onTaskClick(i, $event)"
            @dblclick="editTask(task)"
        />
    </div>
</template>

<style scoped>
:deep([aria-selected="true"]) {
    @apply bg-indigo-900;
}
</style>
