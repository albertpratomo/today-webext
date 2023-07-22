<script setup lang="ts">
import type Task from '~/models/Task';

const emit = defineEmits<{
    clickOutside: []
}>();

const task = defineModel<Task>({required: true});

const onClickOutside = () => emit('clickOutside');
</script>

<template>
    <div
        v-on-click-outside="onClickOutside"
        class="border rounded p-1"
        tabindex="0"
    >
        <TaskInput v-model="task.title" />
    </div>
</template>
