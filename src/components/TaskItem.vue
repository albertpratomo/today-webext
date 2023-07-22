<script setup lang="ts">
import type Task from '~/models/Task';

const task = defineModel<Task>({required: true});

const isEditing = ref(false);
</script>

<template>
    <div
        class="flex items-center"
        tabindex="0"
    >
        <input
            v-model="task.isDone"
            class="mr-2 h-4 w-4"
            type="checkbox"
        >

        <TaskEditor
            v-if="isEditing"
            v-model="task"
            class="grow"
            @click-outside="isEditing = false"
        />

        <label
            v-else
            class="grow border border-transparent p-1"
            @dblclick="isEditing = true"
        >
            {{ task.title }}
        </label>
    </div>
</template>
