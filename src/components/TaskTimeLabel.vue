<script setup lang="ts">
import {useDateFormat, useNow} from '@vueuse/core';
import type Task from '~/models/Task';
import {getTomorrow} from '~/utils/date';

const prop = defineProps<{
    task: Task
}>();

const currentDate = useNow();
const tomorrowsDate = useDateFormat(getTomorrow(), 'YYYY-MM-DD');

const dayLabel = computed(() => {
    if (prop.task.scheduledFor != null && new Date(prop.task.scheduledFor) <= currentDate.value)
        return 'today';
    else if (prop.task.scheduledFor === tomorrowsDate.value)
        return 'tomorrow';
});
</script>

<template>
    <div
        v-if="dayLabel"
        class="mr-[6px] border border-gray-700 rounded-[3px] bg-gray-800 px-[6px] py-1 text-[11px] font-450 leading-3 text-gray-300"
    >
        {{ $t(`sidebar.${dayLabel}`) }}
    </div>
</template>
