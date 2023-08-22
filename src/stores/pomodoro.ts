import {acceptHMRUpdate, defineStore, storeToRefs} from 'pinia';
import {useTasksStore} from './tasks';
import {useTimer} from '~/utils/useTimer';

const POMODORO_DURATION = 25 * 60;

export const usePomodoroStore = defineStore('pomodoro', () => {
    /**
     * The id of the task that the user is focusing on.
     */
    const _taskId = ref<number | null>(null);

    const {tasks} = storeToRefs(useTasksStore());

    const task = computed(() => {
        return _taskId.value
            ? tasks.value.find(t => t.id === _taskId.value)
            : null;
    });

    function focusTask(id: number | null) {
        _taskId.value = id;
    }

    const timer = useTimer(POMODORO_DURATION);

    // Icon Badge -------------------------------------------------------------

    browser.action.setBadgeBackgroundColor({color: '#12131A'});
    browser.action.setBadgeTextColor({color: '#ECEDFA'});

    watchEffect(() => {
        const text = _taskId.value
            ? `${timer.minutes.value}:${timer.seconds.value}`
            : '';

        browser.action.setBadgeText({text});
    });

    return {
        task,
        ...timer,
        focusTask,
    };
});

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(usePomodoroStore, import.meta.hot));
