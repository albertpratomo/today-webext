<script setup lang="ts">
import '~/styles/mobiscroll.scss';
import * as luxon from 'luxon';
import {type MbscEventDeletedEvent, MbscEventcalendar, type MbscEventcalendarOptions} from '@mobiscroll/vue';
import {luxonTimezone} from '@mobiscroll/vue';
import {storeToRefs} from 'pinia';
import {useCalendarStore} from '~/stores';

const {calendarColorId, events} = storeToRefs(useCalendarStore());
const {createEvent, deleteEvent, updateEvent} = useCalendarStore();

luxonTimezone.luxon = luxon;

const options: MbscEventcalendarOptions = {
    dataTimezone: 'utc',
    displayTimezone: 'local',
    dateFormatLong: 'DD MMM',
    dragToMove: true,
    dragToResize: true,
    eventDelete: true,
    externalDrop: true,
    showControls: false,
    theme: 'ios',
    themeVariant: 'dark',
    timeFormat: 'H',
    timezonePlugin: luxonTimezone,
    view: {schedule: {type: 'day', days: false}},
};

function _deleteEvent(args: MbscEventDeletedEvent) {
    const id = args.event.id;
    if (id)
        deleteEvent(id);
}
</script>

<template>
    <div class="relative h-full">
        <div class="h-full overflow-y-hidden">
            <MbscEventcalendar
                v-bind="options"
                :data="events"
                @event-created="createEvent"
                @event-deleted="_deleteEvent"
                @event-updated="updateEvent"
            >
                <template #scheduleEvent="{original}">
                    <CalendarEvent
                        :calendar-color-id="calendarColorId"
                        :event="original"
                    />
                </template>
            </MbscEventcalendar>
        </div>

        <Suspense>
            <CalendarConnectCard class="absolute bottom-0 right-0 z-10" />
        </Suspense>
    </div>
</template>
