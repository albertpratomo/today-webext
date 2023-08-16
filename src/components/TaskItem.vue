<script setup lang="ts">
import type Task from '~/models/Task';
import {onKeyStroke} from '~/utils/onKeyStroke';
import {useDebounceFn} from '@vueuse/core';
import {usePomodoroStore} from '~/stores';

const {isSelected = false} = defineProps<{isSelected?: boolean}>();
const emit = defineEmits<{
    done: []
}>();

const task = defineModel<Task>({required: true});
const _isDone = ref(task.value.isDone);

const updateIsDone = useDebounceFn((val: boolean) => {
    task.value.isDone = val;

    if (val)
        emit('done');
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

const {startTask} = usePomodoroStore();
</script>

<template>
    <div class="group flex cursor-pointer select-none items-center rounded px-3 py-1.5">
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

        <MaterialSymbolsPlayCircleOutline
            class="hidden group-hover:block hover:text-gray-400"
            @click="startTask(task)"
        />
    </div>
</template>
