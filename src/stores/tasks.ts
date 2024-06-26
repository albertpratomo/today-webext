import {acceptHMRUpdate, defineStore, storeToRefs} from 'pinia';
import {useCalendarStore, useHistoryStore} from '~/stores';
import {useDateFormat, useNow, watchDebounced} from '@vueuse/core';
import {type Event} from '~/models/Event';
import type Task from '~/models/Task';
import {generateTasks} from '~/utils/generateTasks';
import {getTomorrow} from '~/utils/date';
import {i18n} from '~/i18n';
import {notify} from 'notiwind';
import {remove} from 'lodash-es';
import {trackGa} from '~/utils/googleAnalytics';
import {useStorageLocal} from '~/utils/useStorageLocal';

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

    function taskById(id: number) {
        return tasks.value.find(task => task.id === id);
    }

    const selectedTaskIds = ref<number[]>([]);
    const lastSelectedTaskId = computed(() => selectedTaskIds.value.at(-1));

    // Create Task ------------------------------------------------------------

    const lastTaskId = useStorageLocal<number>('lastTaskId', initialTasks.length + 1);

    const BLANK_TASK = Object.freeze({
        title: '',
        note: '',
        isDone: false,
        deletedAt: null,
        subtasks: [],
        scheduledFor: null,
        projectId: null,
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
        const index = typeof lastSelectedTaskId.value === 'number'
            ? tasks.value.findIndex(task => task.id === lastSelectedTaskId.value) + 1
            : 0;

        // Insert the new task there.
        tasks.value.splice(index, 0, draftCreateTask.value);
        useHistoryStore().commit();

        trackGa('task_created');

        // Highlight the newly created task.
        selectedTaskIds.value = [draftCreateTask.value.id];

        const newdraftCreateTask = Object.assign({}, JSON.parse(JSON.stringify(BLANK_TASK)), {
            projectId: draftCreateTask.value.projectId,
            scheduledFor: draftCreateTask.value.scheduledFor,
        });

        draftCreateTask.value = {
            id: ++lastTaskId.value,
            ...newdraftCreateTask,
        };
    };

    const taskCreateDialogIsOpen = ref(false);
    function openTaskCreateDialog(bucket: string) {
        switch (bucket) {
            case 'active':
            case 'inbox':
            case 'later':
                moveTask(draftCreateTask.value, bucket, {showToast: false, unscheduleEvents: false});
                break;

            default:
                scheduleTask(draftCreateTask.value, 'today', {showToast: false, unscheduleEvents: false});
                break;
        }

        taskCreateDialogIsOpen.value = true;
    }

    // Edit Task --------------------------------------------------------------

    const draftEditTask = ref<Task | null>(null);

    function editTask(task: Task) {
        draftEditTask.value = task;
    }

    // Move / Schedule Task ---------------------------------------------------

    interface MoveScheduleOptions {
        showToast?: boolean
        unscheduleEvents?: boolean
    }

    function moveTask(task: Task, destination: 'active' | 'inbox' | 'later', options: MoveScheduleOptions = {}) {
        const {showToast = true, unscheduleEvents = true} = options;

        if (destination === 'inbox') {
            task.projectId = 'inbox';
            task.scheduledFor = null;
        }
        else if (destination === 'active') {
            if (task.projectId === 'inbox')
                task.projectId = null;

            task.scheduledFor = null;
        }
        else if (destination === 'later') {
            if (task.projectId === 'inbox')
                task.projectId = null;

            task.scheduledFor = 'later';
        }

        if (unscheduleEvents)
            deleteTaskEvents(task, 'future');

        if (showToast) {
            notify({
                group: 'general',
                text: i18n.t('tasks.taskMovedMessage', {
                    taskTitle: task.title,
                    destination: i18n.t(`sidebar.${destination}`),
                }),
                isCloseable: true,
            }, 4000);
        }
    }

    function scheduleTask(task: Task, when: Date | 'today' | 'tomorrow' | 'unschedule', options: MoveScheduleOptions = {}) {
        const {showToast = true, unscheduleEvents = true} = options;

        let date;
        let scheduledDate = null;

        if (when instanceof Date)
            date = when;
        else if (when === 'today')
            date = useNow();
        else if (when === 'tomorrow')
            date = getTomorrow();

        if (when !== 'unschedule')
            scheduledDate = useDateFormat(date, 'YYYY-MM-DD').value;

        if (task.scheduledFor !== scheduledDate) {
            task.scheduledFor = scheduledDate;

            if (task.projectId === 'inbox')
                task.projectId = null;

            if (unscheduleEvents)
                deleteTaskEvents(task, 'future');

            if (showToast) {
                const toastText = (when === 'unschedule')
                    ? i18n.t('tasks.taskUnscheduledMessage')
                    : i18n.t('tasks.taskScheduledMessage', {
                        taskTitle: task.title,
                        when: i18n.t(`sidebar.${when}`),
                    });

                notify({
                    group: 'general',
                    text: toastText,
                    isCloseable: true,
                }, 4000);
            }
        }
    }

    // Events -----------------------------------------------------------------

    // TODO: Should be done in BE.
    function addTaskEventId(task: Task, event: Event) {
        if (typeof task.eventIds == 'undefined')
            task.eventIds = [];

        task.eventIds.push(event.id as string);

        if (event.start) {
            const scheduleDate = new Date(event.start);
            scheduleTask(task, scheduleDate, {showToast: false, unscheduleEvents: false});
        }
    }

    // TODO: Should be done in BE.
    function deleteTaskEventId(eventId: string | number) {
        tasks.value.forEach((task) => {
            if (task.eventIds !== undefined && task.eventIds !== null) {
                const indexToRemove = task.eventIds.indexOf(eventId as string);
                if (indexToRemove !== -1)
                    task.eventIds.splice(indexToRemove, 1);
            }
        });
    }

    // TODO: Should be done in BE.
    function deleteTaskEvents(task: Task, type: 'future') {
        const {deleteEvent} = useCalendarStore();
        const {events} = storeToRefs(useCalendarStore());
        if (task.eventIds !== undefined && task.eventIds !== null && task.eventIds.length > 0) {
            const eventIds = [...task.eventIds];
            for (const eventId of eventIds) {
                const currentDate = new Date();

                let event;
                if (type === 'future')
                    event = events.value.find(event => event.id === eventId && new Date(event.start) >= currentDate);

                if (event)
                    deleteEvent(event);
                else
                    deleteTaskEventId(eventId);
            }
        }
    }

    // Done Task --------------------------------------------------------------

    const doneTasks = useStorageLocal<Task[]>('doneTasks', []);

    const isAllDone = computed(() => (!tasks.value.length && !!doneTasks.value.length));

    // Move done tasks to doneTasks after 1800ms.
    watchDebounced(
        () => tasks.value.filter(t => t.isDone).map(t => t.id),
        () => {
            const recentlyDoneTasks = remove(tasks.value, t => t.isDone);

            if (recentlyDoneTasks.length > 0) {
                doneTasks.value.unshift(...recentlyDoneTasks);

                trackGa('tasks_completed', {count: recentlyDoneTasks.length});
            }
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

        trackGa('subtask_created');

        // Highlight the newly created subtask.
        selectedSubtasks.value = [index];
    };

    return {
        tasks,
        taskById,
        selectedTaskIds,
        lastSelectedTaskId,

        lastTaskId,
        draftCreateTask,
        draftCreateTaskHasContent,
        createTask,
        taskCreateDialogIsOpen,
        openTaskCreateDialog,

        draftEditTask,
        editTask,

        moveTask,
        scheduleTask,

        addTaskEventId,
        deleteTaskEventId,
        deleteTaskEvents,

        doneTasks,
        isAllDone,

        selectedSubtasks,
        createSubtask,
    };
});

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useTasksStore, import.meta.hot));
