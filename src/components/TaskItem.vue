<script setup lang="ts">
import type Task from '~/models/Task';

const task = defineModel<Task>({required: true});
</script>

<template>
    <div class="flex items-center rounded p-1.5">
        <input
            v-model="task.isDone"
            class="mr-1.5 h-4 w-4"
            type="checkbox"
        >

        <div
            class="h-7 grow border border-transparent px-1.5 py-1"
            v-html="task.title"
        />
    </div>
</template>
