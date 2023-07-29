import type Task from '~/models/Task';
import {defineStore} from 'pinia';
import {useStorageLocal} from '~/utils/useStorageLocal';

export const useTasksStore = defineStore('tasks', () => {
    const tasks = useStorageLocal<Task[]>('tasks', []);

    // Create Task ------------------------------------------------------------

    const blankTask = {
        title: '',
        note: '',
        isDone: false,
    };

    const draftCreateTask = useStorageLocal<Task>('draftCreateTask', blankTask);

    function createTask() {
        tasks.value.unshift(draftCreateTask.value);

        draftCreateTask.value = blankTask;
    };

    return {
        tasks,
        draftCreateTask,
        createTask,
    };
});
