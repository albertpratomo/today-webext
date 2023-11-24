<script setup lang="ts">
import '~/styles/mobiscroll.scss';
import * as luxon from 'luxon';
import {MbscEventcalendar, type MbscEventcalendarOptions} from '@mobiscroll/vue';
import {useCalendarStore, useTasksStore} from '~/stores';
import {luxonTimezone} from '@mobiscroll/vue';
import {storeToRefs} from 'pinia';

const {events} = storeToRefs(useCalendarStore());
const {createEvent, deleteEvent, updateEvent} = useCalendarStore();
const {taskById} = useTasksStore();

luxonTimezone.luxon = luxon;

const options: MbscEventcalendarOptions = {
    dataTimezone: 'utc',
    displayTimezone: 'local',
    dateFormatLong: 'DD MMM', // TODO: seems not working
    dragToMove: true,
    dragToResize: true,
    eventDelete: true,
    externalDrop: true,
    showControls: false,
    theme: 'ios',
    themeVariant: 'dark',
    timezonePlugin: luxonTimezone,
    view: {schedule: {type: 'day', days: false}},
};

function _createEvent(args: any) {
    createEvent(args);

    if (typeof args.event.task_id === 'number') {
        const taskToEdit = taskById(args.event.task_id);
        if (taskToEdit)
            taskToEdit.parent = 'today';
    }
}
</script>

<template>
    <div class="relative h-full">
        <MbscEventcalendar
            v-bind="options"
            :data="events"
            @event-created="_createEvent"
            @event-deleted="deleteEvent"
            @event-updated="updateEvent"
        />

        <Suspense>
            <CalendarConnectCard class="absolute bottom-0 right-0 z-10" />
        </Suspense>
    </div>
</template>
