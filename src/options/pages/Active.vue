<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useTasksStore} from '~/stores/tasks';

const bucket = 'active';
const {tasks, doneTasks} = storeToRefs(useTasksStore());

const _tasks = computed(() => {
    return tasks.value.filter(task =>
        // task.isDone === false &&
        task.projectId !== 'inbox'
        && (
            task.scheduledFor === null
            || task.scheduledFor !== 'later'
        ),
    );
});

const _doneTasks = computed(() => {
    return doneTasks.value.filter(task =>
        task.isDone === true
        && task.projectId !== 'inbox'
        && (
            task.scheduledFor === null
            || task.scheduledFor !== 'later'
        ),
    );
});
</script>

<template>
    <LayoutSidebar>
        <TaskListCalendarDaily
            v-model="_tasks"
            v-model:done-tasks="_doneTasks"
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
