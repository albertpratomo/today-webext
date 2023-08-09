interface Task {
    id: number
    title: string
    note: string
    isDone: boolean
    deletedAt: Date | null
}

export default Task;
