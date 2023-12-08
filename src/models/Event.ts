import type {MbscCalendarEvent} from '@mobiscroll/vue';
import {type calendar_v3} from '@googleapis/calendar';
import {toDateTime} from '~/utils/date';

interface Event {
    id: string
    colorId?: string
    title: string
    start: string
    end: string
    allDay: boolean
}

interface GcalEvent extends calendar_v3.Schema$Event {}

function generateEventId() {
    // Start the id with '_' so we know that this is a local event (not in Gcal yet).
    return `_${String(new Date().getTime())}`;
}

function formatMbscEvent(mbscEvent: MbscCalendarEvent): Event {
    const start = toDateTime(mbscEvent.start!);
    const end = toDateTime(mbscEvent.end!);
    const allDay = mbscEvent.allDay || false;

    return {
        id: mbscEvent.id ? String(mbscEvent.id) : generateEventId(),
        title: mbscEvent.title!,
        start: allDay ? start.toISODate()! : start.toISO()!,
        // If allDay, plus 1 day to end, so Gcal knows it's an allDay event.
        end: allDay ? end.plus({day: 1}).toISODate()! : end.toISO()!,
        allDay,
    };
}

function formatGcalEvent(gcalEvent: GcalEvent): Event {
    return {
        // Most of the time gcalEvent will have an id. In the rare case it doesn't, generate event id.
        id: gcalEvent.id || generateEventId(),
        colorId: gcalEvent.colorId || undefined,
        title: gcalEvent.summary || '',
        start: gcalEvent.start?.dateTime || gcalEvent.start?.date || '',
        end: gcalEvent.end?.dateTime || gcalEvent.end?.date || '',
        // gcalEvent.start.date in 'yyyy-mm-dd' format indicates that this event is all day.
        allDay: Boolean(gcalEvent.start?.date && gcalEvent.start.date.length === 10),
    };
};

export {
    formatMbscEvent, formatGcalEvent, generateEventId,
    Event, GcalEvent,
};
