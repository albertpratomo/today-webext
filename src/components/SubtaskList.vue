<script setup lang="ts">
import type Subtask from '~/models/Subtask';

const emit = defineEmits(['eventEmptyList']);

const subtasks = defineModel<Subtask[]>({required: true});
const selectedSubtasks = defineModel<number[]>('selectedSubtasks', {local: true, default: []});
const lastSelectedSubtask = computed(() => selectedSubtasks.value.at(-1));

function selectSubtask(index: number | number[]) {
    if (!Array.isArray(index))
        index = [index];

    selectedSubtasks.value = index;
}

const moveSelection = function (direction: 'up' | 'down', selectedIndex: number) {
    const subtasksLength = subtasks.value.length;
    const directionDown = direction === 'down';

    const lastIndex = (selectedIndex ?? lastSelectedSubtask.value) ?? (directionDown ? -1 : 0);
    const selected = (lastIndex + (directionDown ? 1 : -1) + subtasksLength) % subtasksLength;

    if (Number.isNaN(selected) || (!directionDown && lastIndex === 0))
        emit('eventEmptyList');
    else if (directionDown && selected === 0)
        return null;
    else
        selectSubtask(selected);
};
</script>

<template>
    <SubtaskItem
        v-for="(_, i) in subtasks"
        :key="i"
        v-model="subtasks[i]"
        :index="i"
        :is-last-selected="lastSelectedSubtask === i"
        :is-selected="selectedSubtasks.includes(i)"
        @move-selection="moveSelection"
    />
</template>
