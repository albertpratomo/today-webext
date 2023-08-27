<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {usePomodoroStore} from '~/stores';

const {
    task, minutes, seconds, isRunning, hasRun, state, isAllDone,
    showWindow, sessionCount,
} = storeToRefs(usePomodoroStore());
const {play, pause, reset, focusTask, skip} = usePomodoroStore();

const el = ref<HTMLElement | null>(null);

watch(task, async (newVal, oldVal) => {
    if (!showWindow.value && oldVal === null && newVal) {
        showWindow.value = true;
        const pomodoroWindow = await documentPictureInPicture.requestWindow({
            width: 300,
            height: 200,
        });

        pomodoroWindow.document.head.insertAdjacentHTML('beforeend', document.head.innerHTML);
        pomodoroWindow.document.body.append(el!.value);

        pomodoroWindow.addEventListener('pagehide', () => {
            pause();
            focusTask(null);
            showWindow.value = false;
        });
    }
});

const buttonClass = 'opacity-0 transition-opacity ease-out hover:text-gray-400 group-hover:opacity-100';
</script>

<template>
    <main
        v-if="showWindow"
        ref="el"
        class="group h-full p-3"
        :class="state.isBreak || isAllDone ? 'bg-green-900' : 'bg-gray-900'"
    >
        <div class="mb-2 flex items-center">
            <div class="text-2xl font-medium">
                {{ minutes }}:{{ seconds }}
            </div>

            <div
                v-if="sessionCount > 0"
                class="ml-2 rounded-full bg-gray-200 px-1 text-xs text-gray-900"
            >
                {{ sessionCount }}
            </div>

            <button
                v-if="task"
                class="ml-auto"
                :class="buttonClass"
            >
                <MaterialSymbolsSkipNext
                    v-if="state.isBreak"
                    @click="skip(); play();"
                />

                <MaterialSymbolsUndo
                    v-else-if="hasRun"
                    @click="reset()"
                />
            </button>

            <button
                v-if="task"
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

        <div class="text-sm">
            <Transition
                mode="out-in"
                name="fade-up"
            >
                <div
                    v-if="task"
                    :key="task.id"
                    class="relative"
                >
                    <div
                        v-if="state.isBreak && !task.isDone"
                        class="pointer-events-none absolute inset-0 group-hover:opacity-0"
                    >
                        {{ $t('pomodoro.breakMessage') }}
                    </div>

                    <div
                        class="flex items-center"
                        :class="{'opacity-0 group-hover:opacity-100': state.isBreak && !task.isDone}"
                    >
                        <input
                            v-model="task.isDone"
                            class="mr-2"
                            type="checkbox"
                        >

                        <div
                            class="transition-colors"
                            :class="{'text-gray-400': task.isDone}"
                            v-html="task.title"
                        />
                    </div>
                </div>

                <div
                    v-else-if="isAllDone"
                    key="done"
                >
                    {{ $t('pomodoro.doneMessage') }}
                </div>
            </Transition>
        </div>
    </main>
</template>
