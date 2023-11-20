import type Task from '~/models/Task';

export function generateTasks(titles: string[]): Task[] {
    return titles.map((title, i) => ({
        id: i + 1,
        parent: 'today',
        title,
        note: '',
        isDone: false,
        deletedAt: null,
        subtasks: [],
    }));
}
