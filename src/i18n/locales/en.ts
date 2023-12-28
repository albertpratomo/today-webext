/* eslint sort-keys: "error" */

export default {
    actions: {
        cancel: 'Cancel',
        confirm: 'Confirm',
        connect: 'Connect',
        createTask: 'Create task',
        delete: 'Delete',
        edit: 'Edit',
        hideCompletedTasks: 'Hide completed tasks',
        moveTo: 'Move to',
        remove: 'Remove',
        schedule: 'Schedule',
        showCompletedTasks: 'Show completed tasks',
    },
    calendarConnectCard: {
        body: 'Sign in to your calendar and see your events here. Or you can do it later in settings.',
        title: 'Connect your Google Calendar',
    },
    comingSoon: 'Coming soon :)',
    events: {
        confirmEventRescheduleMessage: 'Do you want to reschedule and notify the guests?',
        notOrganizerMessage: 'You can\'t reschedule this event.',
        rescheduleEvent: 'Reschedule event',
    },
    fields: {
        taskNote: {placeholder: 'Notes'},
        taskTitle: {placeholder: 'Create a new task, like “Read book”'},
    },
    pomodoro: {
        breakMessage: 'Take a break',
        doneMessage: 'You\'re all done!',
        openWindowTooltip: 'Start pomo [space]',
    },
    settingsCalendars: {
        gcal: {
            connect: {
                subtitle: 'See events from your Google Calendar',
                successMessage: 'Your Google Calendar is connected.',
                title: 'Connect Google Calendar',
            },
        },
        title: 'Calendars',
    },
    sidebar: {
        active: 'Active',
        calendar: 'Calendar',
        inbox: 'Inbox',
        later: 'Later',
        projects: 'Projects',
        settings: 'Settings',
        slack: 'Join Slack',
        today: 'Today',
        tomorrow: 'Tomorrow',
        trash: 'Trash',
    },
    tasks: {
        contextMenu: {
            buckets: 'Buckets',
        },
        taskMovedMessage: 'Task was moved to {destination}',
        taskScheduledMessage: 'Task was scheduled for {when}',
    },
    tooltips: {
        addSubtasks: 'Add subtasks <code>⌘</code> <code>⇧</code> <code>O</code>',
        newTask: 'New task <code>N</code>',
        toggleCalendarDaily: 'Toggle calendar <code>]</code>',
        toggleSidebar: 'Toggle sidebar <code>[</code>',
    },
};
