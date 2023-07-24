<script setup lang="ts">
import type Task from '~/models/Task';

interface Props {
    isSelected: boolean
}

withDefaults(defineProps<Props>(), {
    isSelected: false,
});

const task = defineModel<Task>({required: true});
</script>

<template>
    <div
        class="flex items-center rounded p-1.5"
        :class="{'bg-slate-700': isSelected}"
        tabindex="0"
    >
        <input
            v-model="task.isDone"
            class="mr-1.5 h-4 w-4"
            type="checkbox"
        >

        <TaskEditor
            v-if="task.isEditing"
            v-model="task"
            v-on-click-outside="() => task.isEditing = false"
            class="h-7 grow"
            @keyup.enter="task.isEditing = false"
        />

        <div
            v-else
            class="h-7 grow border border-transparent px-1.5 py-1"
            @dblclick="task.isEditing = true"
            v-html="task.title"
        />
    </div>
</template>

<style scoped>
:deep(code) {
    @apply text-red bg-slate-100 rounded-sm p-px;
}
</style>
