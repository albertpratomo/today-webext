<script setup lang="ts">
import {usePomodoroStore, useTasksStore} from '~/stores';
import {onKeyStroke} from '~/utils/onKeyStroke';
import {storeToRefs} from 'pinia';

const {task, minutes, seconds, isRunning} = storeToRefs(usePomodoroStore());
const {play, pause, reset, focusTask} = usePomodoroStore();

const el = ref<HTMLDivElement | null>(null);

watch(task, async (newVal, oldVal) => {
    if (oldVal === null && newVal) {
        const pomodoroWindow = await documentPictureInPicture.requestWindow({
            width: 300,
            height: 200,
        });

        pomodoroWindow.document.head.insertAdjacentHTML('beforeend', document.head.innerHTML);

        pomodoroWindow.document.body.append(el!.value);

        pomodoroWindow.addEventListener('pagehide', () => {
            focusTask(null);
        });
    }
});

const {selectedIndexes, tasks} = storeToRefs(useTasksStore());
onKeyStroke([' '], () => {
    if (selectedIndexes.value.length === 1)
        focusTask(tasks.value[selectedIndexes.value[0]].id);
}, {dedupe: false});
</script>

<template>
    <main
        v-if="task"
        ref="el"
        class="p-3"
    >
        <div class="flex">
            <div class="text-2xl font-semibold">
                {{ minutes }}:{{ seconds }}
            </div>

            <button
                class="ml-auto"
                @click="!isRunning ? play() : pause()"
            >
                <MaterialSymbolsPlayCircle v-if="!isRunning" />

                <MaterialSymbolsPauseCircle v-else />
            </button>

            <button
                class="ml-2"
                @click="reset()"
            >
                <MaterialSymbolsReplayCircleFilled />
            </button>
        </div>

        <div class="mt-3">
            {{ task!.title }}
        </div>
    </main>
</template>
