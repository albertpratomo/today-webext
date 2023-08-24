<script setup lang="ts">
import type Task from '~/models/Task';
import {onKeyStroke} from '~/utils/onKeyStroke';
import {usePomodoroStore} from '~/stores';

const {isSelected = false} = defineProps<{isSelected?: boolean}>();

const task = defineModel<Task>({required: true});

onKeyStroke(['d', 'D'], () => {
    if (isSelected)
        task.value.isDone = !task.value.isDone;
}, {dedupe: false});

const {focusTask} = usePomodoroStore();
</script>

<template>
    <div class="group flex cursor-pointer select-none items-center rounded p-1 pl-3 hover:bg-gray-800">
        <input
            v-model="task.isDone"
            class="mr-1 border-2"
            type="checkbox"
            @click.stop
            @dblclick.stop
        >

        <div
            class="grow border border-transparent px-1.5 py-1 text-sm font-medium transition-colors"
            :class="{'text-gray-400': task.isDone}"
            v-html="task.title"
        />

        <MaterialSymbolsPlayCircle
            v-if="!task.isDone"
            class="hidden group-hover:block hover:text-gray-400"
            @click="focusTask(task.id)"
        />
    </div>
</template>
