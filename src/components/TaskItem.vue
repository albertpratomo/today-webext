<script setup lang="ts">
import {MbscDraggable} from '@mobiscroll/vue';
import type Task from '~/models/Task';
import {onKeyStroke} from '~/utils/onKeyStroke';
import {pomodoroIsEnabled} from '~/utils/featureToggle';
import {usePomodoroStore} from '~/stores';

const props = withDefaults(
    defineProps<{
        isLastSelected?: boolean
        isSelected?: boolean
    }>(),
    {
        isLastSelected: false,
        isSelected: false,
    },
);

const task = defineModel<Task>({required: true});

onKeyStroke(['d', 'D'], () => {
    if (props.isSelected)
        task.value.isDone = !task.value.isDone;
}, {dedupe: false});

const {focusTask} = usePomodoroStore();

const el = ref(null);
</script>

<template>
    <div
        ref="el"
        class="group h-9 flex cursor-pointer select-none items-center border rounded p-2 hover:bg-gray-800"
        :class="[
            {'bg-indigo-950 hover:bg-indigo-950': isSelected},
            isLastSelected ? 'border-indigo-900' : 'border-transparent',
        ]"
    >
        <button
            v-if="pomodoroIsEnabled"
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
            class="mr-2 cursor-pointer border-2"
            type="checkbox"
            @click.stop
            @dblclick.stop
            @keyup.enter="task.isDone = !(task.isDone)"
        >

        <div
            class="grow border border-transparent text-sm text-gray-200 transition-colors"
            :class="{'text-gray-400': task.isDone}"
            v-html="task.title"
        />

        <MbscDraggable
            :drag-data="{title: task.title}"
            :element="el"
        />
    </div>
</template>
