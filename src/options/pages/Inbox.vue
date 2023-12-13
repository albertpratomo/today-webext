<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useTasksStore} from '~/stores/tasks';

const {tasks: allTasks, doneTasks: allDoneTasks} = storeToRefs(useTasksStore());

const tasks = computed(() => {
    return allTasks.value.filter(task =>
        task.isDone === false
        && task.scheduledFor === null
        && task.projectId === 'inbox',
    );
});

const doneTasks = computed(() => {
    return allDoneTasks.value.filter(task =>
        task.isDone === true
        && task.scheduledFor === null
        && task.projectId === 'inbox',
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
                {{ $t(`sidebar.inbox`) }}
            </template>
        </TaskListCalendarDaily>
    </LayoutSidebar>
</template>
