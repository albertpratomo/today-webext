<script setup lang="ts">
import type Task from '~/models/Task';

const task = defineModel<Task>({required: true});
</script>

<template>
    <div
        class="border rounded bg-gray-800 p-4 text-gray-100"
        tabindex="0"
    >
        <TaskInput v-model="task.title" />
    </div>
</template>
