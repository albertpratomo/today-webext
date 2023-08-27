<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {usePomodoroStore} from '~/stores';

const {task, minutes, seconds, isRunning, state} = storeToRefs(usePomodoroStore());
const {play, pause, reset, focusTask, skip} = usePomodoroStore();

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
            >
                <MaterialSymbolsSkipNext
                    v-if="state.isBreak"
                    @click="skip()"
                />

                <MaterialSymbolsUndo
                    v-else
                    @click="reset()"
                />
            </button>

            <button
                class="ml-2"
                :class="buttonClass"
            >
                <MaterialSymbolsPlayArrow
                    v-if="!isRunning"
                    @click="play()"
                />

                <MaterialSymbolsPause
                    v-else
                    @click="pause()"
                />
            </button>
        </div>

        <Transition
            mode="out-in"
            name="fade-up"
        >
            <div
                :key="task.id"
                class="relative"
            >
                <div
                    v-if="!task.isDone && state.isBreak"
                    class="pointer-events-none absolute inset-0 text-sm group-hover:opacity-0"
                >
                    {{ $t('pomodoro.breakMessage') }}
                </div>

                <div
                    class="flex items-center"
                    :class="{'opacity-0 group-hover:opacity-100': !task.isDone && state.isBreak}"
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
            </div>
        </Transition>
    </main>
</template>
