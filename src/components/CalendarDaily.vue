<script setup lang="ts">
import '~/styles/mobiscroll.scss';
import * as luxon from 'luxon';
import {MbscEventcalendar, type MbscEventcalendarOptions} from '@mobiscroll/vue';
import type {Event} from '~/models/Event';
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
    timeFormat: 'H', // TODO: seems not working
    timezonePlugin: luxonTimezone,
    view: {schedule: {type: 'day', days: false}},
};

function getEventClass(event: Event) {
    if (event.allDay)
        return '';

    const duration = getDuration(event.start, event.end);

    switch (duration) {
        case '15m': return 'flex';
        case '30m': return 'pt-.5';
        default: return 'pt-1';
    }
}
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
            <template #scheduleEvent="{allDay, original, title}">
                <div
                    bg="blueberry-700 hover:blueberry-650 [.mbsc-schedule-event-active_&]:blueberry-600!"
                    class="h-full items-center justify-between rounded px-2"
                    :class="getEventClass(original)"
                >
                    <div class="truncate text-2sm font-medium text-blueberry-200">
                        {{ title }}
                    </div>

                    <div
                        v-if="!allDay"
                        class="text-xs text-blueberry-200/60"
                    >
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
