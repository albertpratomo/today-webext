import {acceptHMRUpdate, defineStore, storeToRefs} from 'pinia';
import type Task from '~/models/Task';
import {pullAt} from 'lodash-es';
import {useHistoryStore} from './history';
import {useStorageLocal} from '~/utils/useStorageLocal';
import {useTasksStore} from '~/stores/tasks';

export const useTrashStore = defineStore('trash', () => {
    const {tasks} = storeToRefs(useTasksStore());
    const trashTasks = useStorageLocal<Task[]>('trashTasks', []);

    function removeTasks(taskIds: number[]) {
        const indexes = taskIds.map(taskId =>
            tasks.value.findIndex(task => task.id === taskId),
        );

        indexes.forEach((i) => {
            tasks.value[i].deletedAt = new Date();
        });

        const removed = pullAt(tasks.value, indexes);

        trashTasks.value.unshift(...removed);

        useHistoryStore().commit();
    }

    return {
        trashTasks,
        removeTasks,
    };
});

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useTrashStore, import.meta.hot));
