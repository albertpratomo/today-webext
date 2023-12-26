import {useDateFormat, useNow} from '@vueuse/core';
import type Subtask from '~/models/Subtask';
import type Task from '~/models/Task';

interface TaskData {
    title: string
    note?: string
    subtasks?: string[]
}

export function generateTasks(tasks: TaskData[]): Task[] {
    const formattedDate = useDateFormat(useNow(), 'YYYY-MM-DD');

    return tasks.map((task, i) => ({
        // TODO: Be cautious when calling this function, because generated task may have duplicate id.
        id: i + 1,
        title: task.title,
        note: task.note || '',
        isDone: false,
        deletedAt: null,
        subtasks: task.subtasks ? generateSubtasks(task.subtasks) : [],
        scheduledFor: formattedDate.value,
        projectId: null,
    }));
}

export function generateSubtasks(titles: string[]): Subtask[] {
    return titles.map((title, i) => ({
        // TODO: Be cautious when calling this function, because generated subtask may have duplicate id.
        id: i + 1,
        title,
        isDone: false,
    }));
}
