import type Subtask from '~/models/Subtask';
import type Task from '~/models/Task';

interface TaskData {
    title: string
    note?: string
    subtasks?: string[]
}

export function generateTasks(tasks: TaskData[]): Task[] {
    return tasks.map((task, i) => ({
        // TODO: Be cautious when calling this function, because generated task may have duplicate id.
        id: i + 1,
        parent: 'today',
        title: task.title,
        note: task.note || '',
        isDone: false,
        deletedAt: null,
        subtasks: task.subtasks ? generateSubtasks(task.subtasks) : [],
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
