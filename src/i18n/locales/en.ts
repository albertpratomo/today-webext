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
    emptyState: {
        active: 'Active list is a home for all tasks you want to commit in the near future. Simply prioritize tasks from <i>Later</i> list when you want to commit on it.<br><br>@:emptyState.defaultFooter',
        defaultFooter: 'Press <code>N</code> to create new tasks',
        inbox: 'Inbox is a place to offload tasks from your head quickly so you can stay focused on what you’re doing.<br><br>Later, process all the tasks in your inbox — move them, schedule them, or delete them.<br><br>@:emptyState.defaultFooter',
        later: 'Sometimes, you have tasks you’d like to work on but are unsure when. Put them to Later list and regularly review them later on.',
        today: {
            body: 'Take a moment to appreciate your accomplishments.<br>Recharge and get ready for tomorrow!',
            title: 'Done for Today',
        },
    },
    events: {
        confirmEventDeclineMessage: 'You\'re about to decline this event and notify the participants.',
        confirmEventDeleteMessage: 'You\'re about to delete this event and notify the participants.',
        confirmEventRescheduleMessage: 'You\'re about to reschedule this event and notify the participants.',
        declineEvent: 'Decline event',
        deleteEvent: 'Delete event',
        eventDeletedMessage: '{title} deleted',
        notOrganizerMessage: 'You can\'t reschedule this event',
        rescheduleEvent: 'Reschedule event',
        unscheduled: 'An event was removed from your calendar | {count} events were removed from your calendar',
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
        taskMovedMessage: 'Task moved to {destination}',
        taskScheduledMessage: 'Task scheduled for {when}',
        taskUnscheduledMessage: 'Task was unscheduled',
    },
    tooltips: {
        addSubtasks: 'Add subtasks <code>⌘</code> <code>⇧</code> <code>O</code>',
        createTask: '<code>⌘</code> <code>Enter</code> to create task<br><code>⌘</code> <code>⇧</code> <code>Enter</code> to create task and close',
        newTask: 'New task <code>N</code>',
        toggleCalendarDaily: 'Toggle calendar <code>]</code>',
        toggleSidebar: 'Toggle sidebar <code>[</code>',
    },
};
