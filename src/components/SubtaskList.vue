<script setup lang="ts">
import {moveArrayElement, useSortable} from '@vueuse/integrations/useSortable';
import type {SortableEvent} from 'sortablejs';
import type Subtask from '~/models/Subtask';
import {onKeyStroke} from '@vueuse/core';

const subtasks = defineModel<Subtask[]>({required: true});
const selectedSubtasks = defineModel<number[]>('selectedSubtasks', {local: true, default: []});

function selectSubtask(index: number | number[]) {
    if (!Array.isArray(index))
        index = [index];

    selectedSubtasks.value = index;
}

const selectSibling = function (direction: 'up' | 'down', selectedIndex: number) {
    const directionDown = direction === 'down';

    const newIndex = selectedIndex + (directionDown ? 1 : -1);

    if (newIndex >= 0 && newIndex < subtasks.value.length)
        selectSubtask(newIndex);
};

onKeyStroke(['ArrowDown', 'ArrowUp'], (e) => {
    e.preventDefault();

    const isArrowDown = e.key === 'ArrowDown';

    if (selectedSubtasks.value.length)
        selectSibling(isArrowDown ? 'down' : 'up', selectedSubtasks.value[0]);
});

const isSorting = ref<boolean>(false);
const list = ref<HTMLElement | null>(null);
useSortable(list, subtasks, {
    onStart: () => {
        isSorting.value = true;
    },
    onEnd: () => {
        isSorting.value = false;
    },
    onUpdate: async (e: SortableEvent) => {
        swapSubtask(e.oldIndex!, e.newIndex!);
    },
});

async function swapSubtask(oldIndex: number, newIndex: number) {
    if (newIndex >= 0 && newIndex < subtasks.value.length) {
        moveArrayElement(subtasks.value, oldIndex, newIndex);
        await nextTick();
        selectSubtask(newIndex);
    }
}
</script>

<template>
    <div ref="list">
        <SubtaskItem
            v-for="(_, i) in subtasks"
            :key="i"
            v-model="subtasks[i]"
            :index="i"
            :is-selected="selectedSubtasks.includes(i)"
            :is-sorting="isSorting"
            @subtask-deleted="selectSibling('up', i)"
        />
    </div>
</template>
