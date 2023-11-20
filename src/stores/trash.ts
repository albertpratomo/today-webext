import {acceptHMRUpdate, defineStore} from 'pinia';
import type Task from '~/models/Task';
import {pullAt} from 'lodash-es';
import {useHistoryStore} from './history';
import {useStorageLocal} from '~/utils/useStorageLocal';

export const useTrashStore = defineStore('trash', () => {
    const tasks = useStorageLocal<Task[]>('trashTasks', []);

    function trashTasks(sourceTasks: Ref<Task[]>, indexes: number[]) {
        indexes.forEach((i) => {
            sourceTasks.value[i].parent = null;
            sourceTasks.value[i].deletedAt = new Date();
        });

        const removed = pullAt(sourceTasks.value, indexes);

        tasks.value.push(...removed);

        useHistoryStore().commit();
    }

    return {
        tasks,
        trashTasks,
    };
});

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useTrashStore, import.meta.hot));
