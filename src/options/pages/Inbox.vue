<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useTasksStore} from '~/stores/tasks';

const bucket = 'inbox';
const {tasks, doneTasks} = storeToRefs(useTasksStore());

const _tasks = computed(() => {
    return tasks.value.filter(task =>
        // task.isDone === false &&
        task.scheduledFor === null
        && task.projectId === 'inbox',
    );
});

const _doneTasks = computed(() => {
    return doneTasks.value.filter(task =>
        task.isDone === true
        && task.scheduledFor === null
        && task.projectId === 'inbox',
    );
});
</script>

<template>
    <LayoutSidebar>
        <TaskListCalendarDaily
            :done-tasks="_doneTasks"
            :show-info-toggle="_tasks.length > 0"
            :tasks="_tasks"
        >
            <template #header>
                {{ $t(`sidebar.${bucket}`) }}
            </template>

            <template #empty-state>
                <TaskListEmptyState :bucket="bucket" />
            </template>
        </TaskListCalendarDaily>
    </LayoutSidebar>
</template>
