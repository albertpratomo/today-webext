import {useStorageLocal} from '~/utils/useStorageLocal';
import type Task from '~/models/Task';

export const tasks = useStorageLocal<Task[]>('tasks', []);

export function newTask(task?: Task) {
    task = {
        title: '',
        isDone: false,
        isEditing: true,
        ...task,
    };

    tasks.value.unshift(task);
}
