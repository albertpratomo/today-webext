<script setup lang="ts">
import type Task from '~/models/Task';

const task = defineModel<Task>({required: true});
</script>

<template>
    <div
        class="border rounded bg-slate-800 px-1.5 py-1"
        tabindex="0"
    >
        <TaskInput v-model="task.title" />
    </div>
</template>
