import {acceptHMRUpdate, defineStore} from 'pinia';
import type Task from '~/models/Task';
import {generateTasks} from '~/utils/generateTasks';
import {remove} from 'lodash-es';
import {useHistoryStore} from '~/stores';
import {useStorageLocal} from '~/utils/useStorageLocal';
import {watchDebounced} from '@vueuse/core';

export const useTasksStore = defineStore('tasks', () => {
    const initialTasks = [
        {
            title: 'Press <code>N</code> to create a new task ✨',
        },
        // {
        //     'title': 'Select me and press <code>space</code>',
        // },
        {
            title: 'Connect your Google Calendar',
        },
        {
            title: 'Drag and drop me to the calendar to plan your day',
        },
        {
            title: 'ProTip: Use arrow keys to navigate',
        },
        {
            title: 'Clarify the fuzzy task with subtasks',
            note: 'Break a task into smaller steps with subtasks. You can use it to make the grocery list or define steps to finish a task. Or list down items to bring for your trip 🏝️:',
            subtasks: ['Passport', 'Charger', 'Sunscreen', 'Toothbrush'],
        },
    ];

    const tasks = useStorageLocal<Task[]>('tasks', generateTasks(initialTasks));

    const selectedIndexes = ref<number[]>([]);
    const lastSelectedIndex = computed(() => selectedIndexes.value.at(-1));

    // Create Task ------------------------------------------------------------

    const lastTaskId = useStorageLocal<number>('lastTaskId', initialTasks.length + 1);

    const BLANK_TASK = Object.freeze({
        title: '',
        note: '',
        isDone: false,
        deletedAt: null,
        subtasks: [],
    });

    const draftCreateTask = useStorageLocal<Task>('draftCreateTask', {
        id: lastTaskId.value,
        ...JSON.parse(JSON.stringify(BLANK_TASK)),
    });

    const draftCreateTaskHasContent = computed(() => {
        const {note, subtasks} = draftCreateTask.value;

        return draftCreateTask.value.title
            || (note && note !== '<p></p>')
            || subtasks?.length;
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
            ...JSON.parse(JSON.stringify(BLANK_TASK)),
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

    const lastSubtaskId = useStorageLocal<number>('lastSubtaskId', 0);

    const BLANK_SUBTASK = Object.freeze({
        title: '',
        isDone: false,
    });

    function createSubtask() {
        const parentTask = (draftEditTask.value ?? draftCreateTask.value);
        if (!parentTask)
            return false;

        // Find the last selected subtask.
        const index = selectedSubtasks.value.length && parentTask.subtasks?.length
            ? (selectedSubtasks.value.at(-1) || 0) + 1
            : 0;

        if (typeof parentTask.subtasks == 'undefined')
            parentTask.subtasks = [];

        // Insert the new subtask there.
        parentTask.subtasks.splice(index, 0, {
            id: ++lastSubtaskId.value,
            ...BLANK_SUBTASK,
        });

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
