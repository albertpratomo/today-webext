import {acceptHMRUpdate, defineStore} from 'pinia';
import type Task from '~/models/Task';
import {computedEager} from '@vueuse/core';
import {useHistoryStore} from '~/stores';
import {useStorageLocal} from '~/utils/useStorageLocal';

export const useTasksStore = defineStore('tasks', () => {
    const tasks = useStorageLocal<Task[]>('tasks', []);
    const selectedIndexes = ref<number[]>([]);

    // Create Task ------------------------------------------------------------

    const lastTaskId = useStorageLocal<number>('lastTaskId', 1);

    const BLANK_TASK = Object.freeze({
        title: '',
        note: '',
        isDone: false,
        deletedAt: null,
    });

    const draftCreateTask = useStorageLocal<Task>('draftCreateTask', {
        id: lastTaskId.value,
        ...BLANK_TASK,
    });

    const draftCreateTaskHasContent = computedEager(() => {
        const {note} = draftCreateTask.value;

        return draftCreateTask.value.title
            || (note && note !== '<p></p>');
    });

    function createTask() {
        // Find the last selected index.
        const index = selectedIndexes.value.length
            ? (selectedIndexes.value.at(-1) || 0) + 1
            : 0;

        // Insert the new task there.
        tasks.value.splice(index, 0, draftCreateTask.value);
        useHistoryStore().commit();

        // Highlight the newly created task.
        selectedIndexes.value = [index];

        draftCreateTask.value = {
            id: ++lastTaskId.value,
            ...BLANK_TASK,
        };
    };

    const taskCreateDialogIsOpen = ref(false);

    // Edit Task --------------------------------------------------------------

    const draftEditTask = ref<Task | null>(null);

    function editTask(task: Task) {
        draftEditTask.value = task;
    }

    return {
        tasks,
        selectedIndexes,

        lastTaskId,
        draftCreateTask,
        draftCreateTaskHasContent,
        createTask,
        taskCreateDialogIsOpen,

        draftEditTask,
        editTask,
    };
});

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useTasksStore, import.meta.hot));
