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
            class="h-7 grow"
            @click-outside="isEditing = false"
        />

        <label
            v-else
            class="h-7 grow border border-transparent px-2 py-1"
            @dblclick="isEditing = true"
            v-html="task.title"
        />
    </div>
</template>

<style scoped>
:deep(code) {
    @apply text-red bg-slate-100 rounded-sm p-px;
}
</style>
