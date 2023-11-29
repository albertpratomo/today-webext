import type Task from '~/models/Task';
import {generateSubtasks} from '~/utils/generateSubtasks';

export function generateTasks(tasks: any[]): Task[] {
    return tasks.map((task, i) => ({
        id: i + 1,
        title: task.title,
        note: task.note,
        isDone: false,
        deletedAt: null,
        subtasks: (task.subtasks ? generateSubtasks(task.subtasks) : []),
    }));
}
