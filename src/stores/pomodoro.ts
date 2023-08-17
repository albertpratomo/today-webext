import {acceptHMRUpdate, defineStore} from 'pinia';
import type Task from '~/models/Task';
import {useTimer} from '~/utils/useTimer';

const POMODORO_DURATION = 25 * 60;

export const usePomodoroStore = defineStore('pomodoro', () => {
    /**
     * The floating window's id.
     */
    const windowId = ref<number | null>(null);

    /**
     * The task that the user is focusing on.
     */
    const task = ref<Task | null>(null);

    async function focusTask(_task: Task) {
        task.value = _task;

        if (windowId.value) {
            browser.windows.update(windowId.value, {
                focused: true,
                drawAttention: true,
            });
        }
        else {
            const floatingWindow = await browser.windows.create({
                width: 300,
                height: 200,
                type: 'popup',
                url: 'dist/options/index.html#/pomodoro',
            });

            windowId.value = floatingWindow.id!;
        }
    }

    browser.windows.onRemoved.addListener((id) => {
        if (id === windowId.value)
            windowId.value = null;
    });

    const timer = useTimer(POMODORO_DURATION);

    return {
        task,
        focusTask,
        ...timer,
    };
});

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(usePomodoroStore, import.meta.hot));
