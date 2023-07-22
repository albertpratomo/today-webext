<script setup lang="ts">
import {onKeyStroke} from '@vueuse/core';
import {tasks} from '~/logic';

const selected = ref<number[]>([]);

onKeyStroke('ArrowUp', (event) => {
    event.preventDefault();
});

onKeyStroke('ArrowDown', (event) => {
    event.preventDefault();
});
</script>

<template>
    <div v-on-click-outside="() => selected = []">
        <TaskItem
            v-for="(_, i) in tasks"
            :key="i"
            v-model="tasks[i]"
            :is-selected="selected.includes(i)"
            @click="selected = [i]"
        />
    </div>
</template>
