import {acceptHMRUpdate, defineStore} from 'pinia';
import type Task from '~/models/Task';
import {useTimer} from '~/utils/useTimer';

const POMODORO_DURATION = 25 * 60;

export const usePomodoroStore = defineStore('pomodoro', () => {
    /**
     * The task that the user is focusing on.
     */
    const task = ref<Task | null>(null);

    const timer = useTimer(POMODORO_DURATION);

    // Floating Window --------------------------------------------------------

    /**
     * The floating window's id.
     */
    const windowId = ref<number | null>(null);

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

            floatingWindow.alwaysOnTop = true;

            windowId.value = floatingWindow.id!;
        }
    }

    browser.windows.onRemoved.addListener((id) => {
        if (id === windowId.value)
            windowId.value = null;
    });

    // Icon Badge -------------------------------------------------------------

    browser.action.setBadgeBackgroundColor({color: '#12131A'});
    browser.action.setBadgeTextColor({color: '#ECEDFA'});

    watchEffect(() => {
        const text = windowId.value
            ? `${timer.minutes.value}:${timer.seconds.value}`
            : '';

        browser.action.setBadgeText({text});
    });

    return {
        task,
        ...timer,
        windowId,
        focusTask,
    };
});

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(usePomodoroStore, import.meta.hot));
