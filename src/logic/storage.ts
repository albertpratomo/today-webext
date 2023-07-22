import {useStorageLocal} from '~/composables/useStorageLocal';
import type Task from '~/models/Task';

export const tasks = useStorageLocal<Task[]>('tasks', []);
