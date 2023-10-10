import type Task from '~/models/Task';

export function generateTasks(titles: string[]): Task[] {
    return titles.map((title, i) => ({
        id: i + 1,
        title,
        note: '',
        isDone: false,
        deletedAt: null,
        subtasks: [],
    }));
}
