import type Task from '~/models/Task';
import {defineStore} from 'pinia';
import {useStorageLocal} from '~/utils/useStorageLocal';

export const useTasksStore = defineStore('tasks', () => {
    const tasks = useStorageLocal<Task[]>('tasks', []);

    // Create Task ------------------------------------------------------------

    const BLANK_TASK = Object.freeze({
        title: '',
        note: '',
        isDone: false,
    });

    const draftCreateTask = useStorageLocal<Task>('draftCreateTask', {...BLANK_TASK});

    function createTask() {
        tasks.value.unshift(draftCreateTask.value);

        draftCreateTask.value = {...BLANK_TASK};
    };

    const taskCreateDialogIsOpen = ref(false);

    return {
        tasks,

        draftCreateTask,
        createTask,
        taskCreateDialogIsOpen,
    };
});
