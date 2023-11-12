<script setup lang="ts">
import '~/styles/mobiscroll.scss';
import {MbscEventcalendar, type MbscEventcalendarOptions} from '@mobiscroll/vue';
import {storeToRefs} from 'pinia';
import {useCalendarStore} from '~/stores';

const {events} = storeToRefs(useCalendarStore());
const {createEvent, deleteEvent, updateEvent} = useCalendarStore();

const options: MbscEventcalendarOptions = {
    dateFormatLong: 'DD MMM', // TODO: seems not working
    dragToMove: true,
    dragToResize: true,
    eventDelete: true,
    externalDrop: true,
    showControls: false,
    view: {schedule: {type: 'day', days: false}},
};
</script>

<template>
    <MbscEventcalendar
        v-bind="options"
        :data="events"
        @event-created="createEvent"
    />
</template>
