<script setup lang="ts">
import {usePomodoroStore, useTasksStore} from '~/stores';
import {onKeyStroke} from '~/utils/onKeyStroke';
import {storeToRefs} from 'pinia';

const {task, minutes, seconds, isRunning} = storeToRefs(usePomodoroStore());
const {play, pause, reset, focusTask} = usePomodoroStore();

const el = ref<HTMLElement | null>(null);

watch(task, async (newVal, oldVal) => {
    if (oldVal === null && newVal) {
        const pomodoroWindow = await documentPictureInPicture.requestWindow({
            width: 300,
            height: 200,
        });

        pomodoroWindow.document.head.insertAdjacentHTML('beforeend', document.head.innerHTML);

        pomodoroWindow.document.body.append(el!.value);

        pomodoroWindow.addEventListener('pagehide', () => {
            pause();
            focusTask(null);
        });
    }
});

const {selectedIndexes, tasks} = storeToRefs(useTasksStore());
onKeyStroke([' '], () => {
    if (selectedIndexes.value.length === 1)
        focusTask(tasks.value[selectedIndexes.value[0]].id);
}, {dedupe: false});

const buttonClass = 'opacity-0 transition-opacity ease-out hover:text-gray-400 group-hover:opacity-100';
</script>

<template>
    <main
        v-if="task"
        ref="el"
        class="group h-full p-3"
    >
        <div class="flex">
            <div class="text-2xl font-medium">
                {{ minutes }}:{{ seconds }}
            </div>

            <button
                class="ml-auto"
                :class="buttonClass"
                @click="reset()"
            >
                <MaterialSymbolsUndo />
            </button>

            <button
                class="ml-2"
                :class="buttonClass"
                @click="!isRunning ? play() : pause()"
            >
                <MaterialSymbolsPlayArrow v-if="!isRunning" />

                <MaterialSymbolsPause v-else />
            </button>
        </div>

        <div class="mt-2 flex items-center">
            <input
                v-model="task.isDone"
                class="mr-2"
                type="checkbox"
            >

            <div
                class="text-sm transition-colors"
                :class="{'text-gray-400': task.isDone}"
                v-html="task.title"
            />
        </div>
    </main>
</template>
