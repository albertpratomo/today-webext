<script setup lang="ts">
import type Subtask from '~/models/Subtask';

const subtasks = defineModel<Subtask[]>({required: true});
const selectedSubtasks = defineModel<number[]>('selectedSubtasks', {local: true, default: []});
const lastSelectedSubtasks = computed(() => selectedSubtasks.value.at(-1));
</script>

<template>
    <SubtaskItem
        v-for="(subtask, i) in subtasks"
        :key="i"
        v-model="subtasks[i]"
        :index="i"
        :is-last-selected-subtask="lastSelectedSubtasks === i"
        :is-selected-subtask="selectedSubtasks.includes(i)"
    />
</template>
