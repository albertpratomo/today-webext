import type {Event, FcEvent, GcalEvent} from '~/models/Event';
import {acceptHMRUpdate, defineStore} from 'pinia';
import {createFetch, useLocalStorage} from '@vueuse/core';
import {formatFcEvent, formatGcalEvent} from '~/models/Event';
import {getTimeOfDay} from '~/utils/date';
import {useStorageLocal} from '~/utils/useStorageLocal';

export const useCalendarStore = defineStore('calendar', () => {
    // There are 3 possible states:
    // null -> user hasn't decided to connect or not
    // empty string '' -> user has chosen to disconnect
    // non-empty string ->  user has chosen to connnect
    const authToken = useLocalStorage<string | null>('calendarAuthToken', null);

    // The email account who owns the calendars.
    const calendarEmail = useLocalStorage<string>('calendarEmail', '');

    const events = useStorageLocal<Event[]>('events', []);

    async function getAuthToken() {
        // `chrome.identity.getAuthToken` didn't work in Arc. This is a work-around
        // using `chrome.identity.launchWebAuthFlow`, as explained in
        // https://github.com/GoogleChrome/developer.chrome.com/issues/7434
        const url = new URL('https://accounts.google.com/o/oauth2/auth');
        const manifest = chrome.runtime.getManifest();
        url.searchParams.set('client_id', manifest.oauth2!.client_id);
        url.searchParams.set('response_type', 'token');
        url.searchParams.set('scope', manifest.oauth2!.scopes!.join(' '));
        url.searchParams.set('redirect_uri', chrome.identity.getRedirectURL());

        const response = await chrome.identity.launchWebAuthFlow({
            interactive: true,
            url: url.href,
        });

        const params = new URLSearchParams(response?.split('#')[1]);

        authToken.value = params.get('access_token');
    }

    const useGcalApi = createFetch({
        baseUrl: 'https://www.googleapis.com/calendar/v3',
        options: {
            beforeFetch({url, options}) {
                options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${authToken.value}`,
                };

                url += `${url.includes('?') ? '&' : '?'}key=AIzaSyC2G-xvTc95LDqX1SCEhdyh0Z9_uipiqdo`;

                return {url, options};
            },
        },
    });

    async function fetchGcalEvents(calendarId: string = 'primary') {
        // Store local events (unsynced) to Gcal.
        const localEvents = events.value.filter(e => e.id.startsWith('_'));
        for (const localEvent of localEvents)
            await storeGcalEvent(localEvent.title, localEvent.start, localEvent.end);

        // Fetch Gcal events.
        const params = new URLSearchParams({
            timeMin: getTimeOfDay(new Date(), 'start'),
            timeMax: getTimeOfDay(new Date(), 'end'),
            singleEvents: 'true',
        });

        const result = await useGcalApi(
            `calendars/${calendarId}/events?${params.toString()}`,
        ).json<{items: GcalEvent[]; summary: string}>();

        if (!result.error.value && result.data.value) {
            // Store the fetched Gcal events locally.
            events.value = result.data.value.items.map(i => formatGcalEvent(i));

            // Store the email of the Gcal account.
            calendarEmail.value = result.data.value.summary;
        }

        return result;
    }

    async function storeGcalEvent(summary: string, start: string, end: string) {
        return await useGcalApi('calendars/primary/events').post({
            summary,
            start: {dateTime: start},
            end: {dateTime: end},
        }).json<GcalEvent>();
    }

    async function createEvent(fcEvent: FcEvent) {
        if (authToken.value) {
            const result = await storeGcalEvent(fcEvent.title, fcEvent.startStr, fcEvent.endStr);

            if (!result.error.value && result.data.value)
                // Set gcal generated id to the event instance.
                fcEvent.setProp('id', result.data.value.id);
        }

        events.value.push(formatFcEvent(fcEvent));
    }

    async function updateEvent(fcEvent: FcEvent) {
        // Update local events with the updated fcEvent.
        const index = events.value.findIndex(e => e.id === fcEvent.id);
        events.value[index] = formatFcEvent(fcEvent);

        if (authToken.value) {
            await useGcalApi(`calendars/primary/events/${fcEvent.id}`).patch({
                start: {dateTime: fcEvent.startStr},
                end: {dateTime: fcEvent.endStr},
            }).json();
        }
    }

    async function deleteEvent(id: string) {
        // Delete the event from local events.
        events.value = events.value.filter(e => e.id !== id);

        if (authToken.value)
            await useGcalApi(`calendars/primary/events/${id}`).delete();
    }

    return {
        authToken,
        calendarEmail,
        events,

        createEvent,
        deleteEvent,
        fetchGcalEvents,
        getAuthToken,
        updateEvent,
    };
});

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useCalendarStore, import.meta.hot));
