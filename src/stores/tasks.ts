import type Task from '~/models/Task';
import {defineStore} from 'pinia';
import {useStorageLocal} from '~/utils/useStorageLocal';

export const useTasksStore = defineStore('tasks', () => {
    const tasks = useStorageLocal<Task[]>('tasks', []);

    // Select Task ------------------------------------------------------------

    const selectedIndexes = ref<number[]>([]);

    const selectedTask = computed(() => {
        if (tasks.value.length && selectedIndexes.value.length === 1)
            return tasks.value[selectedIndexes.value[0]];

        return null;
    });

    function selectTask(index: number | number[]) {
        if (!Array.isArray(index))
            index = [index];

        selectedIndexes.value = index;
    }

    // Create Task ------------------------------------------------------------

    const BLANK_TASK = Object.freeze({
        title: '',
        note: '',
        isDone: false,
    });

    const draftCreateTask = useStorageLocal<Task>('draftCreateTask', {...BLANK_TASK});

    const draftCreateTaskHasContent = computed(() => {
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

        // Highlight the newly created task.
        selectTask(index);

        draftCreateTask.value = {...BLANK_TASK};
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
        selectedTask,
        selectTask,

        draftCreateTask,
        draftCreateTaskHasContent,
        createTask,
        taskCreateDialogIsOpen,

        draftEditTask,
        editTask,
    };
});
