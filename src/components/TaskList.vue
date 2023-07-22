<script setup lang="ts">
import {onKeyStroke} from '@vueuse/core';
import type Task from '~/models/Task';

const tasks = defineModel<Task[]>({required: true});

const selected = ref<number[]>([]);

onKeyStroke('ArrowUp', (event) => {
    event.preventDefault();
});

onKeyStroke('ArrowDown', (event) => {
    event.preventDefault();
});

function onTaskClick(index: number, {ctrlKey, metaKey}: PointerEvent) {
    if (ctrlKey || metaKey)
        selected.value.push(index);
    else
        selected.value = [index];
};
</script>

<template>
    <div v-on-click-outside="() => selected = []">
        <TaskItem
            v-for="(_, i) in tasks"
            :key="i"
            v-model="tasks[i]"
            :aria-selected="selected.includes(i)"
            :is-selected="selected.includes(i)"
            @click="onTaskClick(i, $event)"
        />
    </div>
</template>
