import {useStorageLocal} from '~/composables/useStorageLocal';
import type Task from '~/models/Task';

export const tasks = useStorageLocal<Task[]>('tasks', []);

export function newTask(task: Task = {title: 'start with a verb', isDone: false}) {
    tasks.value.unshift(task);
}
