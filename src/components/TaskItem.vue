<script setup lang="ts">
import type Task from '~/models/Task';
import {onKeyStroke} from '~/utils/onKeyStroke';
import {useDebounceFn} from '@vueuse/core';

const {isSelected = false} = defineProps<{isSelected?: boolean}>();
const task = defineModel<Task>({required: true});
const _isDone = ref(task.value.isDone);

const updateIsDone = useDebounceFn((val: boolean) => {
    task.value.isDone = val;
}, 1800);

watch(_isDone, (val) => {
    if (!task.value.isDone)
        updateIsDone(val);
    else
        task.value.isDone = val;
});

onKeyStroke(['d', 'D'], () => {
    if (isSelected)
        _isDone.value = !_isDone.value;
});
</script>

<template>
    <div class="flex cursor-pointer select-none items-center rounded p-1.5 pl-3">
        <input
            v-model="_isDone"
            class="mr-1"
            type="checkbox"
            @click.stop
            @dblclick.stop
        >

        <div
            class="grow border border-transparent px-1.5 py-1 transition-colors"
            :class="{'text-gray-400': _isDone}"
            v-html="task.title"
        />
    </div>
</template>
