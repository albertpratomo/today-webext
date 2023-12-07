<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useNow} from '@vueuse/core';
import {useTasksStore} from '~/stores/tasks';

const collection = 'today';

const {tasks: allTasks, doneTasks: allDoneTasks} = storeToRefs(useTasksStore());

const currentDate = useNow();

const tasks = computed(() => {
    return allTasks.value.filter(task =>
        task.isDone === false
        && task.scheduledFor != null
        && new Date(task.scheduledFor) <= currentDate.value,
    );
});

const doneTasks = computed(() => {
    return allDoneTasks.value.filter(task =>
        task.isDone === true
        && task.scheduledFor != null
        && new Date(task.scheduledFor) <= currentDate.value,
    );
});
</script>

<template>
    <LayoutSidebar>
        <TaskListCalendarDaily
            v-model="tasks"
            v-model:done-tasks="doneTasks"
            :collection="collection"
            :date="currentDate"
        />
    </LayoutSidebar>
</template>
