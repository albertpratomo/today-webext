<script setup lang="ts">
import '~/styles/mobiscroll.scss';
import * as luxon from 'luxon';
import {MbscEventcalendar, type MbscEventcalendarOptions} from '@mobiscroll/vue';
import {luxonTimezone} from '@mobiscroll/vue';
import {storeToRefs} from 'pinia';
import {useCalendarStore} from '~/stores';

const {events} = storeToRefs(useCalendarStore());
const {createEvent, deleteEvent, updateEvent} = useCalendarStore();

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
</script>

<template>
    <div class="relative h-full">
        <MbscEventcalendar
            v-bind="options"
            :data="events"
            @event-created="createEvent"
            @event-deleted="deleteEvent"
            @event-updated="updateEvent"
        />

        <Suspense>
            <CalendarConnectCard class="absolute bottom-0 right-0 z-10" />
        </Suspense>
    </div>
</template>
