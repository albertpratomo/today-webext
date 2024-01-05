<script setup lang="ts">
import '~/styles/mobiscroll.scss';
import * as luxon from 'luxon';
import ConfirmDialog, {type Props as ConfirmDialogProps} from './ConfirmDialog.vue';
import type {MbscEventDeleteEvent, MbscEventUpdateEvent, MbscEventcalendarOptions} from '@mobiscroll/vue';
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

const confirmDialog = ref<InstanceType<typeof ConfirmDialog> | null>(null);
const confirmDialogProps = reactive<ConfirmDialogProps>({
    title: '',
    description: '',
    confirmButtonText: '',
    confirmButtonVariant: 'primary',
});

async function onEventUpdate(args: MbscEventUpdateEvent) {
    const event = formatMbscEvent(args.event);

    if (event.isSelfOrganized) {
        if (event.hasAttendees) {
            confirmDialogProps.title = event.title;
            confirmDialogProps.description = t('events.confirmEventRescheduleMessage');
            confirmDialogProps.confirmButtonText = t('events.rescheduleEvent');
            confirmDialogProps.confirmButtonVariant = 'primary';

            const confirmed = await confirmDialog.value!.confirm();

            if (confirmed)
                updateGcalEvent(event);
            else
                // Update event back to the old data.
                args.inst?.updateEvent([args.oldEvent]);
        }
        else {
            updateGcalEvent(event);
        }

        return true;
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

async function onEventDelete(args: MbscEventDeleteEvent) {
    const event = formatMbscEvent(args.event);

    if (event.hasAttendees) {
        confirmDialogProps.title = event.title;
        confirmDialogProps.description = event.isSelfOrganized
            ? t('events.confirmEventDeleteMessage')
            : t('events.confirmEventDeclineMessage');
        confirmDialogProps.confirmButtonText = event.isSelfOrganized
            ? t('events.deleteEvent')
            : t('events.declineEvent');
        confirmDialogProps.confirmButtonVariant = 'critical';

        const confirmed = await confirmDialog.value!.confirm();

        if (confirmed)
            deleteEvent(event);

        return false;
    }
    else {
        deleteEvent(event);

        return true;
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
                @event-delete="onEventDelete"
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

        <ConfirmDialog
            v-bind="confirmDialogProps"
            ref="confirmDialog"
        />
    </div>
</template>
