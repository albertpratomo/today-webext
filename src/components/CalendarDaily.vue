<script setup lang="ts">
import '~/styles/mobiscroll.scss';
import * as luxon from 'luxon';
import type {MbscEventUpdateEvent, MbscEventcalendarOptions} from '@mobiscroll/vue';
import {MbscEventcalendar, luxonTimezone} from '@mobiscroll/vue';
import {formatMbscEvent} from '~/models/Event';
import {notify} from 'notiwind';
import {storeToRefs} from 'pinia';
import {useCalendarStore} from '~/stores';

const {t} = useI18n();

const {calendarColorId, events} = storeToRefs(useCalendarStore());
const {createEvent, deleteEvent, updateGcalEvent} = useCalendarStore();

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

function onEventUpdate(args: MbscEventUpdateEvent) {
    const event = formatMbscEvent(args.event);

    if (event.isSelfOrganized) {
        if (event.hasAttendees)
            confirm('update attendees');

        updateGcalEvent(event);
    }
    else {
        notify({
            group: 'general',
            text: t('events.notOrganizerMessage'),
            isCloseable: true,
        });

        return false;
    }
}
</script>

<template>
    <div class="relative h-full">
        <div class="h-full overflow-y-hidden">
            <MbscEventcalendar
                v-bind="options"
                :data="events"
                @event-created="createEvent"
                @event-deleted="deleteEvent"
                @event-update="onEventUpdate"
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
