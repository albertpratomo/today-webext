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
        :class="{'bg-indigo-900': isSelected}"
    >
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
