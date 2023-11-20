import type Subtask from './Subtask';

interface Task {
    id: number
    parent: string | null
    title: string
    note: string
    isDone: boolean
    // TODO: Parse string to Date from localStorage.
    deletedAt: Date | null
    subtasks: Subtask[]
}

export default Task;
