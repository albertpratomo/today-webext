<script setup lang="ts">
import '~/styles/mobiscroll.scss';
import * as luxon from 'luxon';
import {MbscEventcalendar, type MbscEventcalendarOptions} from '@mobiscroll/vue';
import {useCalendarStore, useTasksStore} from '~/stores';
import {useDateFormat, useNow} from '@vueuse/core';
import type {Event} from '~/models/Event';
import {getDuration} from '~/utils/date';
import {luxonTimezone} from '@mobiscroll/vue';
import {storeToRefs} from 'pinia';

const {events} = storeToRefs(useCalendarStore());
const {createEvent, deleteEvent, updateEvent} = useCalendarStore();
const {moveTask} = useTasksStore();

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

function _createEvent(args: any) {
    createEvent(args);

    if (typeof args.event.task_id === 'number')
        moveTask(args.event.task_id, 'today');
}

const currentDate = useDateFormat(useNow(), 'DD MMM');

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
        <div class="h-full overflow-y-hidden">
            <div class="mb-2 text-sm font-medium text-gray-500">
                {{ currentDate }}
            </div>

            <MbscEventcalendar
                v-bind="options"
                :data="events"
                @event-created="_createEvent"
                @event-deleted="deleteEvent"
                @event-updated="updateEvent"
            >
                <template #scheduleEvent="{allDay, original, title}">
                    <div
                        bg="blueberry-700 hover:blueberry-650 [.mbsc-schedule-event-active_&]:blueberry-600!"
                        class="h-full items-center justify-between border-r border-gray-850 rounded px-2"
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
        </div>

        <Suspense>
            <CalendarConnectCard class="absolute bottom-0 right-0 z-10" />
        </Suspense>
    </div>
</template>
