interface Task {
    id: number
    title: string
    note: string
    isDone: boolean
    // TODO: Parse string to Date from localStorage.
    deletedAt: Date | null
}

export default Task;
