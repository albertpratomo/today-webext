import type Task from '~/models/Task';
import {defineStore} from 'pinia';
import pullAt from 'lodash/pullAt';
import {useStorageLocal} from '~/utils/useStorageLocal';

export const useTrashStore = defineStore('trash', () => {
    const tasks = useStorageLocal<Task[]>('trashTasks', []);

    function trashTasks(sourceTasks: Ref<Task[]>, indexes: number[]) {
        indexes.forEach((i) => {
            sourceTasks.value[i].deletedAt = new Date();
        });

        const removed = pullAt(sourceTasks.value, indexes);

        tasks.value.push(...removed);
    }

    return {
        tasks,
        trashTasks,
    };
});
