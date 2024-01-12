<script setup lang="ts">
import {useDateFormat, useNow} from '@vueuse/core';
import type Task from '~/models/Task';
import {getTomorrow} from '~/utils/date';
import {storeToRefs} from 'pinia';
import {useCalendarStore} from '~/stores';

const prop = defineProps<{
    bucket: string
    task: Task
}>();

const {events} = storeToRefs(useCalendarStore());

const {t} = useI18n();

const currentDate = useNow({interval: 5000});
const tomorrowsDate = useDateFormat(getTomorrow(), 'YYYY-MM-DD 00:00:00');

function labelName(date: Date | string) {
    const _date = useDateFormat(date, 'YYYY-MM-DD 00:00:00');

    if (new Date(_date.value) <= currentDate.value)
        return t('sidebar.today');
    else if (_date.value === tomorrowsDate.value)
        return t('sidebar.tomorrow');
    else
        return useDateFormat(_date, 'D MMM').value;
}

const timeLabel = computed(() => {
    const eventIds = prop.task.eventIds;
    if (eventIds) {
        const todaysEventDates = events.value
            .filter(event => eventIds.includes(event.id) && (useDateFormat(event.start, 'YYYY-MM-DD 00:00:00') >= useDateFormat(currentDate.value, 'YYYY-MM-DD 00:00:00')))
            .map(event => new Date(event.start))
            .sort((a: any, b: any) => a - b);

        const eventStartDates = todaysEventDates
            .filter(startDate => (new Date(startDate) >= currentDate.value))
            .sort((a: any, b: any) => a - b);

        // If no future start date, use past start date
        if(eventStartDates.length === 0 && todaysEventDates.length > 0)
            eventStartDates.push(todaysEventDates[todaysEventDates.length - 1]);

        if (eventStartDates.length > 0) {
            const time = useDateFormat(eventStartDates[0], 'HH.mm');
            if (prop.bucket === 'today') {
                return time.value;
            }
            else {
                const day = labelName(eventStartDates[0]);
                return `${day}, ${time.value}`;
            }
        }
    }

    if (prop.task.scheduledFor != null && prop.bucket !== 'today')
        return labelName(prop.task.scheduledFor);
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
