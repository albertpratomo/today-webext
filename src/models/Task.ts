import type Subtask from './Subtask';

interface Task {
    id: number
    title: string
    note: string
    isDone: boolean
    // TODO: Parse string to Date from localStorage.
    deletedAt: Date | null
    subtasks: Subtask[]
    scheduledFor?: string
    projectId?: string
}

export default Task;
