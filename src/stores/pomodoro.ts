import {acceptHMRUpdate, defineStore, storeToRefs} from 'pinia';
import {find} from 'lodash-es';
import {onKeyStroke} from '~/utils/onKeyStroke';
import {usePomodoroCycle} from '~/utils/usePomodoroCycle';
import {useTasksStore} from './tasks';
import {watchDebounced} from '@vueuse/core';

export const usePomodoroStore = defineStore('pomodoro', () => {
    /**
     * The id of the task that the user is focusing on.
     */
    const _taskId = ref<number | null>(null);

    const showWindow = ref(false);

    const {lastSelectedIndex, tasks, isAllDone} = storeToRefs(useTasksStore());

    const task = computed(() => {
        return _taskId.value
            ? tasks.value.find(t => t.id === _taskId.value)
            : null;
    });

    function focusTask(id: number | null) {
        _taskId.value = id;
    }

    function focusNextTask() {
        const index = task.value ? tasks.value.indexOf(task.value) : -1;

        let nextTask = find(tasks.value, t => !t.isDone, index + 1);

        // If no next task, find any undone task.
        if (!nextTask)
            nextTask = find(tasks.value, t => !t.isDone);

        if (nextTask)
            focusTask(nextTask.id);
    }

    watchDebounced(
        () => !!task.value?.isDone,
        (isDone) => {
            if (isDone)
                focusNextTask();
        },
        {debounce: 1750},
    );

    onKeyStroke([' '], () => {
        if (typeof lastSelectedIndex.value === 'number')
            focusTask(tasks.value[lastSelectedIndex.value].id);
    }, {dedupe: false});

    // Cycle & Timer ----------------------------------------------------------

    const {skip, state, timer, resetCycle, sessionCount} = usePomodoroCycle();

    watch(isAllDone, (done) => {
        if (!showWindow.value)
            return;

        if (done) {
            _taskId.value = null;
            resetCycle();
        }
        else {
            focusNextTask();
        }
    });

    return {
        task,
        ...timer,
        state,
        isAllDone,
        showWindow,
        sessionCount,
        skip,
        focusTask,
        focusNextTask,
    };
});

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(usePomodoroStore, import.meta.hot));
