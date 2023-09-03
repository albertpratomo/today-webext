<script setup lang="ts">
import type Task from '~/models/Task';
import {onKeyStroke} from '~/utils/onKeyStroke';
import {usePomodoroStore} from '~/stores';

const {isLastSelected = false, isSelected = false} = defineProps<{
    isLastSelected?: boolean
    isSelected?: boolean
}>();

const task = defineModel<Task>({required: true});

onKeyStroke(['d', 'D'], () => {
    if (isSelected)
        task.value.isDone = !task.value.isDone;
}, {dedupe: false});

const {focusTask} = usePomodoroStore();
</script>

<template>
    <div
        class="group flex cursor-pointer select-none items-center border rounded p-2 hover:bg-gray-800"
        :class="[
            {'bg-indigo-900 hover:bg-indigo-900': isSelected},
            isLastSelected ? 'border-indigo-400' : 'border-transparent',
        ]"
    >
        <button
            class="mr-2 opacity-0 group-hover:opacity-100"
            :class="{'invisible': task.isDone || task.deletedAt, 'opacity-100': isLastSelected}"
            text="indigo-400 hover:indigo-300 active:indigo-500"
            :title="$t('pomodoro.openWindowTooltip')"
            @click="focusTask(task.id)"
        >
            <MaterialSymbolsPlayArrow />
        </button>

        <input
            v-model="task.isDone"
            class="mr-2 border-2"
            type="checkbox"
            @click.stop
            @dblclick.stop
        >

        <div
            class="h-5 grow border border-transparent text-sm font-medium transition-colors"
            :class="{'text-gray-400': task.isDone}"
            v-html="task.title"
        />
    </div>
</template>
