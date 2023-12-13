<script setup lang="ts">
import {useDateFormat, useNow} from '@vueuse/core';
import {storeToRefs} from 'pinia';
import {useTasksStore} from '~/stores/tasks';

const {tasks, doneTasks} = storeToRefs(useTasksStore());

const currentDate = useNow();
const titleDate = useDateFormat(currentDate, 'DD MMM YYYY');

const _tasks = computed(() => {
    return tasks.value.filter(task =>
        task.isDone === false
        && task.scheduledFor != null
        && new Date(task.scheduledFor) <= currentDate.value,
    );
});

const _doneTasks = computed(() => {
    return doneTasks.value.filter(task =>
        task.isDone === true
        && task.scheduledFor != null
        && new Date(task.scheduledFor) <= currentDate.value,
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
                {{ $t(`sidebar.today`) }}
                <span class="ml-1 text-gray-500">
                    {{ titleDate }}
                </span>
            </template>
        </TaskListCalendarDaily>
    </LayoutSidebar>
</template>
