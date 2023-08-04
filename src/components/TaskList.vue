<script setup lang="ts">
import {moveArrayElement, useSortable} from '@vueuse/integrations/useSortable';
import type {SortableEvent} from 'sortablejs';
import type Task from '~/models/Task';
import {onKeyStroke} from '~/utils/onKeyStroke';
import {useTasksStore} from '~/stores/tasks';

const {editTask} = useTasksStore();
const tasks = defineModel<Task[]>({required: true});
const selectedIndexes = defineModel<number[]>('selectedIndexes', {required: true});

function selectTask(index: number | number[]) {
    if (!Array.isArray(index))
        index = [index];

    selectedIndexes.value = index;
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

        selectTask(Array.from(new Set([
            ...selectedIndexes.value,
            ...Array.from(
                {length: Math.abs(clicked - lastIndex) + 1},
                (_, i) => Math.min(clicked, lastIndex) + i,
            ),
        ])));
    }
    else {
        // Replace the whole selection.
        selectTask(clicked);
    }
}

const onClickOutside = [
    () => selectTask([]),
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
            selectTask(selectedIndexes.value.filter(i => i !== lastIndex));
        else
            selectedIndexes.value.push(selected);
    }
    else if (e.altKey && selectedIndexes.value.length === 1) {
        const oldIndex = selectedIndexes.value[0];
        const newIndex = oldIndex + (isArrowDown ? 1 : -1);
        swapTask(oldIndex, newIndex);
    }
    else { selectTask(selected); }
});

onKeyStroke(['Esc', 'Escape'], () => {
    selectTask([]);
});

const list = ref<HTMLElement | null>(null);
useSortable(list, tasks, {
    onUpdate: async (e: SortableEvent) => {
        swapTask(e.oldIndex, e.newIndex);
    },
});

async function swapTask(oldIndex: number, newIndex: number) {
    if (newIndex >= 0 && newIndex < tasks.value.length) {
        moveArrayElement(tasks.value, oldIndex, newIndex);

        await nextTick();

        selectTask(newIndex);
    }
}
</script>

<template>
    <div
        ref="list"
        v-on-click-outside="onClickOutside"
    >
        <TaskItem
            v-for="(task, i) in tasks"
            :key="`${i}-${task.title}`"
            v-model="tasks[i]"
            :aria-selected="selectedIndexes.includes(i)"
            @click="onTaskClick(i, $event)"
            @dblclick="editTask(task)"
            @dragstart="selectTask(i)"
        />
    </div>
</template>

<style scoped>
:deep([aria-selected="true"]) {
    @apply bg-indigo-900;
}
</style>
