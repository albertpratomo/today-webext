<script setup lang="ts">
import {useDateFormat, useNow} from '@vueuse/core';
import type Task from '~/models/Task';
import {getTomorrow} from '~/utils/date';
import {storeToRefs} from 'pinia';
import {useCalendarStore} from '~/stores';

const {bucket, task} = defineProps<{
    bucket: string
    task: Task
}>();

const {events} = storeToRefs(useCalendarStore());

const {t} = useI18n();

const currentDate = useNow({interval: 5000});
const tomorrowDate = useDateFormat(getTomorrow(), 'YYYY-MM-DD 00:00:00');

function formatDate(date: Date | string) {
    const _date = useDateFormat(date, 'YYYY-MM-DD 00:00:00');

    if (new Date(_date.value) <= currentDate.value)
        return t('sidebar.today');
    else if (_date.value === tomorrowDate.value)
        return t('sidebar.tomorrow');
    else
        return useDateFormat(_date, 'D MMM').value;
}

const timeLabel = computed(() => {
    // Sort events schedule for current date & task and return nearest future date (or latest past time as the fallback)
    const eventIds = task.eventIds;
    if (eventIds) {
        // Array of all events schedule for current date & task
        const currentDateEvents = events.value
            .filter(event => eventIds.includes(event.id) && (useDateFormat(event.start, 'YYYY-MM-DD 00:00:00') >= useDateFormat(currentDate.value, 'YYYY-MM-DD 00:00:00')))
            .map(event => new Date(event.start))
            .sort((a: any, b: any) => a - b);

        // Return all future start dates sorted by nearest first
        const futureStartDates = currentDateEvents
            .filter(startDate => (new Date(startDate) >= currentDate.value))
            .sort((a: any, b: any) => a - b);

        // If no future start date, use past start date
        if(futureStartDates.length === 0 && currentDateEvents.length > 0)
            futureStartDates.push(currentDateEvents[currentDateEvents.length - 1]);

        if (futureStartDates.length > 0) {
            const time = useDateFormat(futureStartDates[0], 'HH.mm');
            if (bucket === 'today') {
                return time.value;
            }
            else {
                const day = formatDate(futureStartDates[0]);
                return `${day}, ${time.value}`;
            }
        }
    }

    if (task.scheduledFor != null && bucket !== 'today')
        return formatDate(task.scheduledFor);
});
</script>

<template>
    <div
        v-if="timeLabel"
        class="mr-[6px] whitespace-nowrap border border-gray-750 rounded-[3px] bg-gray-800 px-[6px] py-1 text-[11px] font-450 leading-3 tracking-wider text-gray-400"
    >
        {{ timeLabel }}
    </div>
</template>
