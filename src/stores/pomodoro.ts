import {acceptHMRUpdate, defineStore, storeToRefs} from 'pinia';
import {useTasksStore} from './tasks';
import {useTimer} from '~/utils/useTimer';

const POMODORO_DURATION = 25 * 60;

export const usePomodoroStore = defineStore('pomodoro', () => {
    /**
     * The id of the task that the user is focusing on.
     */
    const taskId = ref<number | null>(null);

    const {tasks} = storeToRefs(useTasksStore());

    const task = computed(() => {
        return taskId.value
            ? tasks.value.find(t => t.id === taskId.value)
            : null;
    });

    function focusTask(id: number) {
        taskId.value = id;
    }

    const timer = useTimer(POMODORO_DURATION);

    return {
        task,
        ...timer,
        focusTask,
    };
});

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(usePomodoroStore, import.meta.hot));
