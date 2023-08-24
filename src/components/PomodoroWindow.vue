<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {usePomodoroStore} from '~/stores';

const {task, minutes, seconds, isRunning, state} = storeToRefs(usePomodoroStore());
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

const buttonClass = 'opacity-0 transition-opacity ease-out hover:text-gray-400 group-hover:opacity-100';
</script>

<template>
    <main
        v-if="task"
        ref="el"
        class="group h-full p-3"
        :class="state.isBreak ? 'bg-green-900' : 'bg-gray-900'"
    >
        <div class="mb-2 flex items-center">
            <div class="text-2xl font-medium">
                {{ minutes }}:{{ seconds }}
            </div>

            <div class="ml-2 rounded-full bg-gray-200 px-1 text-xs text-gray-900">
                {{ state.sessionCount }}
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

        <Transition
            mode="out-in"
            name="fade-up"
        >
            <div
                v-if="!state.isBreak"
                :key="task.id"
                class="flex items-center"
            >
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

            <div
                v-else
                class="text-sm"
            >
                {{ $t('pomodoro.breakMessage') }}
            </div>
        </Transition>
    </main>
</template>
