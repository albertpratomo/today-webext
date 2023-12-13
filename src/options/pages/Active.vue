<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useTasksStore} from '~/stores/tasks';

const {tasks: allTasks, doneTasks: allDoneTasks} = storeToRefs(useTasksStore());

const tasks = computed(() => {
    return allTasks.value.filter(task =>
        task.isDone === false
        && task.projectId !== 'inbox'
        && (
            task.scheduledFor === null
            || task.scheduledFor !== 'someday'
        ),
    );
});

const doneTasks = computed(() => {
    return allDoneTasks.value.filter(task =>
        task.isDone === true
        && task.projectId !== 'inbox'
        && (
            task.scheduledFor === null
            || task.scheduledFor !== 'someday'
        ),
    );
});
</script>

<template>
    <LayoutSidebar>
        <TaskListCalendarDaily
            v-model="tasks"
            v-model:done-tasks="doneTasks"
        >
            <template #header>
                {{ $t(`sidebar.active`) }}
            </template>
        </TaskListCalendarDaily>
    </LayoutSidebar>
</template>
