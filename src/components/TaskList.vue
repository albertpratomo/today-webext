<script setup lang="ts">
import {onKeyStroke} from '@vueuse/core';
import type Task from '~/models/Task';
import {newTask} from '~/stores/tasks';

const tasks = defineModel<Task[]>({required: true});

const selected = ref<number[]>([]);

function onTaskEnter(task: Task, index: number) {

}

function onTaskClick(index: number, {ctrlKey, metaKey}: PointerEvent) {
    if (ctrlKey || metaKey)
        selected.value.push(index);
    else
        selected.value = [index];
};

function getIsSelected(task: Task, index: number) {
    return task.isEditing || selected.value.includes(index);
}

onKeyStroke('ArrowUp', (event) => {
    event.preventDefault();
});

onKeyStroke('ArrowDown', (event) => {
    event.preventDefault();
});

onKeyStroke(['n', 'N'], (e) => {
    if (e.target instanceof HTMLElement && !e.target.isContentEditable)
        newTask();
}, {eventName: 'keyup'});
</script>

<template>
    <div v-on-click-outside="() => selected = []">
        <TaskItem
            v-for="(task, i) in tasks"
            :key="i"
            v-model="tasks[i]"
            :aria-selected="getIsSelected(task, i)"
            :is-selected="getIsSelected(task, i)"
            @click="onTaskClick(i, $event)"
            @keyup.enter="onTaskEnter(task, i)"
        />
    </div>
</template>
