<script setup lang="ts">
import type Task from '~/models/Task';

const modelValue = defineModel<Task>({required: true});
</script>

<template>
    <div class="flex items-center">
        <input
            v-model="modelValue.isDone"
            class="h-4 w-4 border-gray-300 rounded bg-gray-100 text-blue-600 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            type="checkbox"
        >

        <label class="ml-2">
            {{ modelValue.title }}
        </label>
    </div>
</template>
