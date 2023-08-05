<script setup lang="ts">
import type Task from '~/models/Task';

const task = defineModel<Task>({required: true});
</script>

<template>
    <div class="flex cursor-pointer select-none items-center rounded p-1.5 pl-3">
        <input
            v-model="task.isDone"
            class="mr-1"
            type="checkbox"
            @click.stop
            @dblclick.stop
        >

        <div
            class="grow border border-transparent px-1.5 py-1 transition-colors"
            :class="{'text-gray-400': task.isDone}"
            v-html="task.title"
        />
    </div>
</template>
