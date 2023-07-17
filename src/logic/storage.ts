import {useStorageLocal} from '~/composables/useStorageLocal';

export const tasks = useStorageLocal('tasks', []);
