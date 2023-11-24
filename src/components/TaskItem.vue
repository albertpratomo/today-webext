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
    <div class="group relative">
        <div
            ref="el"
            class="h-9 cursor-pointer select-none items-center border rounded p-2 !flex group-hover:bg-gray-800"
            :class="[
                {'bg-indigo-950 group-hover:bg-indigo-950': isSelected},
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
                class="grow truncate border border-transparent text-sm text-gray-200 transition-colors"
                :class="{'text-gray-400': task.isDone}"
                v-html="task.title"
            />

            <MbscDraggable
                :drag-data="{title: task.title}"
                :element="el"
            />
        </div>

        <button
            class="drag-handle absolute right-3 top-2 ml-1 mt-[2px] h-4 text-gray-350 opacity-0 group-hover:opacity-100"
            :class="{'opacity-100': isSelected}"
            tabindex="-1"
        >
            <svg
                fill="none"
                height="7"
                viewBox="0 0 10 7"
                width="10"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g opacity="0.3">
                    <path
                        clip-rule="evenodd"
                        d="M0 0H10V1H0V0ZM0 6H10V7H0V6ZM10 3H0V4H10V3Z"
                        fill="#E0E1EC"
                        fill-rule="evenodd"
                    />
                </g>
            </svg>
        </button>
    </div>
</template>
