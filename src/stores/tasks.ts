import type Task from '~/models/Task';
import {defineStore} from 'pinia';
import {useStorageLocal} from '~/utils/useStorageLocal';

export const useTasksStore = defineStore('tasks', () => {
    const tasks = useStorageLocal<Task[]>('tasks', []);

    const selectedIndexes = ref<number[]>([]);

    // Create Task ------------------------------------------------------------

    const BLANK_TASK = Object.freeze({
        title: '',
        note: '',
        isDone: false,
    });

    const draftCreateTask = useStorageLocal<Task>('draftCreateTask', {...BLANK_TASK});

    function createTask() {
        // Find the last selected index.
        const index = selectedIndexes.value.length
            ? (selectedIndexes.value.at(-1) || 0) + 1
            : 0;

        // Insert the new task there.
        tasks.value.splice(index, 0, draftCreateTask.value);

        // Highlight the newly created task.
        selectedIndexes.value = [index];

        draftCreateTask.value = {...BLANK_TASK};
    };

    const taskCreateDialogIsOpen = ref(false);

    return {
        tasks,
        selectedIndexes,

        draftCreateTask,
        createTask,
        taskCreateDialogIsOpen,
    };
});
