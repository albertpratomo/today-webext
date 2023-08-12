import {acceptHMRUpdate, defineStore, storeToRefs} from 'pinia';
import {useTasksStore, useTrashStore} from '~/stores';
import {cloneDeep} from 'lodash-es';
import {onKeyStroke} from '~/utils/onKeyStroke';
import {useManualRefHistory} from '@vueuse/core';

export const useHistoryStore = defineStore('history', () => {
    const {tasks} = storeToRefs(useTasksStore());
    const {tasks: trashTasks} = storeToRefs(useTrashStore());

    const historiable = computed({
        get: () => ({tasks: tasks.value, trashTasks: trashTasks.value}),
        set: (val) => {
            tasks.value = val.tasks;
            trashTasks.value = val.trashTasks;
        },
    });

    const {history, undo, redo, commit} = useManualRefHistory(historiable, {
        capacity: 10,
        clone: cloneDeep,
    });

    onKeyStroke(['z', 'Z'], ({metaKey, ctrlKey, shiftKey}) => {
        if ((metaKey || ctrlKey))
            shiftKey ? redo() : undo();
    });

    return {
        history,
        commit,
    };
});

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useHistoryStore, import.meta.hot));
