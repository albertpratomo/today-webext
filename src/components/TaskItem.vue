<script setup lang="ts">
import type Task from '~/models/Task';

interface Props {
    isSelected: boolean
}

withDefaults(defineProps<Props>(), {
    isSelected: false,
});

const task = defineModel<Task>({required: true});

const isEditing = ref(false);
</script>

<template>
    <div
        class="flex items-center rounded p-1.5"
        :class="{'bg-slate-7': isSelected}"
        tabindex="0"
    >
        <input
            v-model="task.isDone"
            class="mr-1.5 h-4 w-4"
            type="checkbox"
        >

        <TaskEditor
            v-if="isEditing"
            v-model="task"
            v-on-click-outside="() => isEditing = false"
            class="h-7 grow"
            @keyup.enter="isEditing = false"
        />

        <label
            v-else
            class="h-7 grow border border-transparent px-1.5 py-1"
            @dblclick="isEditing = true"
            v-html="task.title"
        />
    </div>
</template>

<style scoped>
:deep(code) {
    @apply text-red bg-slate-1 rounded-sm p-px;
}
</style>
