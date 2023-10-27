<script setup lang="ts">
import {moveArrayElement, useSortable} from '@vueuse/integrations/useSortable';
import type {SortableEvent} from 'sortablejs';
import type Subtask from '~/models/Subtask';
import {onKeyStroke} from '@vueuse/core';
import {useTasksStore} from '~/stores';

const {createSubtask} = useTasksStore();

const subtasks = defineModel<Subtask[]>({required: true});
const selectedSubtasks = defineModel<number[]>('selectedSubtasks', {default: []});

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

onKeyStroke(['O', 'o'], ({metaKey, shiftKey}) => {
    if (metaKey && shiftKey) {
        if (subtasks.value.length === 0)
            createSubtask();
        else
            selectedSubtasks.value = [0];
    }
});

onKeyStroke(['ArrowDown', 'ArrowUp'], (e) => {
    if (subtasks.value.length && selectedSubtasks.value.length) {
        e.preventDefault();

        selectSibling(e.key === 'ArrowDown' ? 'down' : 'up', selectedSubtasks.value[0]);
    }
});

const isSorting = ref<boolean>(false);
const list = ref<HTMLElement | null>(null);
useSortable(list, subtasks, {
    dragClass: 'bg-gray-750',
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

function deleteSubtask(index: number) {
    subtasks.value.splice(index, 1);
    selectSibling('up', index);
}
</script>

<template>
    <div ref="list">
        <SubtaskItem
            v-for="(subtask, i) in subtasks"
            :key="subtask.id"
            v-model="subtasks[i]"
            :is-editable="!isSorting"
            :is-selected="selectedSubtasks.includes(i)"
            @delete="deleteSubtask(i)"
            @focus="selectSubtask(i)"
        />
    </div>
</template>
