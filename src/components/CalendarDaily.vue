<script setup lang="ts">
import '~/styles/mobiscroll.scss';
import * as luxon from 'luxon';
import {MbscEventcalendar, type MbscEventcalendarOptions} from '@mobiscroll/vue';
import {getDuration} from '~/utils/date';
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
        >
            <template #scheduleEvent="{title, original}">
                <div
                    bg="blueberry-700 hover:blueberry-650 [.mbsc-schedule-event-active_&]:blueberry-600!"
                    class="h-full items-center justify-between border-x border-gray-850 rounded [.fc-timegrid-event-short_&]:flex [.fc-timegrid-event-short_&]:pt-0"
                    p="x-2 t-1"
                >
                    <div class="truncate text-2sm font-medium text-blueberry-200">
                        {{ title }}
                    </div>

                    <div class="text-xs text-blueberry-200/60">
                        {{ getDuration(original.start, original.end) }}
                    </div>
                </div>
            </template>
        </MbscEventcalendar>

        <Suspense>
            <CalendarConnectCard class="absolute bottom-0 right-0 z-10" />
        </Suspense>
    </div>
</template>
