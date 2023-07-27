import type Task from '~/models/Task';
import {defineStore} from 'pinia';
import {useStorageLocal} from '~/utils/useStorageLocal';

export const useTasksStore = defineStore('tasks', () => {
    const tasks = useStorageLocal<Task[]>('tasks', []);

    function newTask(task?: Task) {
        task = {
            title: '',
            isDone: false,
            ...task,
        };

        tasks.value.unshift(task);
    };

    return {tasks, newTask};
});
