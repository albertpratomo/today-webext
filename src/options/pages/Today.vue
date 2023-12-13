<script setup lang="ts">
import {useDateFormat, useNow} from '@vueuse/core';
import {storeToRefs} from 'pinia';
import {useTasksStore} from '~/stores/tasks';

const {tasks: allTasks, doneTasks: allDoneTasks} = storeToRefs(useTasksStore());

const currentDate = useNow();
const titleDate = useDateFormat(currentDate, 'DD MMM YYYY');

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
        >
            <template #header>
                {{ $t(`sidebar.today`) }}
                <span class="ml-1 text-gray-500">
                    {{ titleDate }}
                </span>
            </template>
        </TaskListCalendarDaily>
    </LayoutSidebar>
</template>
