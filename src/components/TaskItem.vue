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

const isActionable = computed(() => task.value.deletedAt === null && task.value.isDone === false);
const subtasksCompleted = computed(() => {
    return task.value.subtasks.reduce((count, item) => {
        if (item.isDone === true)
            return count + 1;
        else
            return count;
    }, 0);
});

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
                class="flex grow truncate border border-transparent text-sm text-gray-200 transition-colors"
                :class="{'text-gray-400': task.isDone}"
            >
                <div v-html="task.title" />

                <div
                    v-if="task.subtasks && task.subtasks.length > 0"
                    class="mx-2 border rounded-[100px] px-2 text-[11px] font-normal text-gray-400"
                >
                    {{ subtasksCompleted }}/{{ task.subtasks.length }}
                </div>
            </div>

            <MbscDraggable
                v-if="isActionable"
                :drag-data="{title: task.title, task}"
                :element="el"
            />

            <TaskContextMenu
                v-if="isActionable"
                v-model="task"
                :parent-element="el"
            />
        </div>

        <button
            v-if="isActionable"
            class="drag-handle absolute bottom-0 right-0 top-0 px-3 text-gray-600 opacity-0 group-hover:opacity-100"
            :class="{'opacity-100': isSelected}"
            tabindex="-1"
        >
            <MaterialSymbolsMenu class="h-3.5" />
        </button>
    </div>
</template>
