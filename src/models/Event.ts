import type {MbscCalendarEvent} from '@mobiscroll/vue';
import {type calendar_v3} from '@googleapis/calendar';

interface Event {
    id: string
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

function dateToString(date?: string | object | Date): string {
    if (typeof date === 'string')
        return date;

    if (date instanceof Date)
        return date.toISOString();

    return '';
}

function formatMbscEvent(mbscEvent: MbscCalendarEvent): Event {
    return {
        id: mbscEvent.id ? String(mbscEvent.id) : generateEventId(),
        title: mbscEvent.title!,
        start: dateToString(mbscEvent.start),
        end: dateToString(mbscEvent.end),
        allDay: mbscEvent.allDay || false,
    };
}

function formatGcalEvent(gcalEvent: GcalEvent): Event {
    return {
        // Most of the time gcalEvent will have an id. In the rare case it doesn't, generate event id.
        id: gcalEvent.id || generateEventId(),
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
