import type Subtask from '~/models/Subtask';
import type Task from '~/models/Task';

export function generateTasks(tasks: any[]): Task[] {
    return tasks.map((task, i) => ({
        id: i + 1,
        title: task.title || '',
        note: task.note || '',
        isDone: false,
        deletedAt: null,
        subtasks: task.subtasks ? generateSubtasks(task.subtasks) : [],
    }));
}

export function generateSubtasks(titles: string[]): Subtask[] {
    return titles.map((title, i) => ({
        id: i + 1,
        title,
        isDone: false,
    }));
}
