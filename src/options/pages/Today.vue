<script setup lang="ts">
import {useDateFormat, useNow} from '@vueuse/core';
import {storeToRefs} from 'pinia';
import {useTasksStore} from '~/stores/tasks';

const {tasks, doneTasks} = storeToRefs(useTasksStore());

const currentDate = useNow();
const titleDate = useDateFormat(currentDate, 'DD MMM YYYY');

const _tasks = computed(() => {
    return tasks.value.filter(task =>
        // task.isDone === false &&
        task.scheduledFor != null
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

            <template #empty-state>
                <div class="h-4/5 flex items-center">
                    <div class="relative mx-auto mb-10 mt-8 max-w-md p-6 text-center">
                        <Icon
                            class="mx-auto mb-4 p-1"
                            name="flower"
                            size="h-14 w-14"
                        />

                        <h2 class="mb-2 text-4 text-gray-300">
                            {{ $t(`emptyState.today.title`) }}
                        </h2>

                        <p
                            class="text-[14px] text-gray-400"
                            v-html="$t(`emptyState.today.body`)"
                        />
                    </div>
                </div>
            </template>
        </TaskListCalendarDaily>
    </LayoutSidebar>
</template>
