import {type EventApi as FcEvent} from '@fullcalendar/core';
import {type calendar_v3} from '@googleapis/calendar';

interface Event {
    id: string
    title: string
    start: string
    end: string
}

interface GcalEvent extends calendar_v3.Schema$Event {}

function generateEventId() {
    return String(new Date().getTime());
}

function formatFcEvent(fcEvent: FcEvent): Event {
    return {
        id: fcEvent.id || generateEventId(),
        title: fcEvent.title,
        start: fcEvent.startStr,
        end: fcEvent.endStr,
    };
}

function formatGcalEvent(gcalEvent: GcalEvent): Event {
    return {
        id: gcalEvent.id || generateEventId(),
        title: gcalEvent.summary || '',
        start: gcalEvent.start?.dateTime || gcalEvent.start?.date || '',
        end: gcalEvent.end?.dateTime || gcalEvent.end?.date || '',
    };
};

export {formatFcEvent, formatGcalEvent, Event, FcEvent, GcalEvent};
