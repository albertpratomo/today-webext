import {acceptHMRUpdate, defineStore} from 'pinia';
import type Task from '~/models/Task';
import {remove} from 'lodash-es';
import {useHistoryStore} from '~/stores';
import {useStorageLocal} from '~/utils/useStorageLocal';
import {watchDebounced} from '@vueuse/core';

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

    // Focus Task -------------------------------------------------------------

    const focusedTask = ref<Task | null>(null);

    function focusTask(task: Task) {
        focusedTask.value = task;
    }

    // Done Task --------------------------------------------------------------

    const doneTasks = useStorageLocal<Task[]>('doneTasks', []);

    // Move done tasks to doneTasks after 1800ms.
    watchDebounced(
        () => tasks.value.filter(t => t.isDone).map(t => t.id),
        () => {
            doneTasks.value.unshift(...remove(tasks.value, t => t.isDone));
        },
        {debounce: 1800},
    );

    // Move undone tasks back to tasks immediately.
    watch(
        () => doneTasks.value.some(t => !t.isDone),
        () => {
            tasks.value.unshift(...remove(doneTasks.value, t => !t.isDone));
        },
    );

    return {
        tasks,
        doneTasks,
        selectedIndexes,

        lastTaskId,
        draftCreateTask,
        draftCreateTaskHasContent,
        createTask,
        taskCreateDialogIsOpen,

        draftEditTask,
        editTask,

        focusedTask,
        focusTask,
    };
});

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useTasksStore, import.meta.hot));
