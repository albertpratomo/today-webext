import {acceptHMRUpdate, defineStore} from 'pinia';
import type Task from '~/models/Task';
import {generateTasks} from '~/utils/generateTasks';
import {remove} from 'lodash-es';
import {useHistoryStore} from '~/stores';
import {useStorageLocal} from '~/utils/useStorageLocal';
import {watchDebounced} from '@vueuse/core';

export const useTasksStore = defineStore('tasks', () => {
    const tasks = useStorageLocal<Task[]>('tasks', generateTasks([
        'Press <code>N</code> to create a new task ✨',
        'Select me and press <code>space</code>',
        'ProTip: Use arrow keys to navigate',
    ]));

    const selectedIndexes = ref<number[]>([]);
    const lastSelectedIndex = computed(() => selectedIndexes.value.at(-1));

    // Create Task ------------------------------------------------------------

    const lastTaskId = useStorageLocal<number>('lastTaskId', 4);

    const BLANK_TASK = Object.freeze({
        title: '',
        note: '',
        isDone: false,
        deletedAt: null,
        subtasks: [],
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
        if (!draftCreateTaskHasContent.value)
            return;

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

    const isAllDone = computed(() => (!tasks.value.length && !!doneTasks.value.length));

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

    // Subtasks ---------------------------------------------------------------

    const selectedSubtasks = ref<number[]>([]);

    // Create Subtask ---------------------------------------------------------

    const BLANK_SUBTASK = Object.freeze({
        title: '',
        isDone: false,
    });

    function createSubtask() {
        if (!draftEditTask.value)
            return false;

        // Find the last selected subtask.
        const index = selectedSubtasks.value.length
            ? (selectedSubtasks.value.at(-1) || 0) + 1
            : 0;

        if (typeof draftEditTask.value.subtasks == 'undefined')
            draftEditTask.value.subtasks = [];

        // Insert the new subtask there.
        draftEditTask.value?.subtasks.splice(index, 0, {...BLANK_SUBTASK});

        // Highlight the newly created subtask.
        selectedSubtasks.value = [index];
    };

    return {
        tasks,
        selectedIndexes,
        lastSelectedIndex,

        lastTaskId,
        draftCreateTask,
        draftCreateTaskHasContent,
        createTask,
        taskCreateDialogIsOpen,

        draftEditTask,
        editTask,

        focusedTask,
        focusTask,

        doneTasks,
        isAllDone,

        selectedSubtasks,
        createSubtask,
    };
});

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useTasksStore, import.meta.hot));
