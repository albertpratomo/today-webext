import type Subtask from '~/models/Subtask';

export function generateSubtasks(subtasks: string[]): Subtask[] {
    return subtasks.map((subtask, i) => ({
        id: i + 1,
        title: subtask,
        isDone: false,
    }));
}
