import {type Event, type GcalEvent, generateEventId} from '~/models/Event';
import type {MbscEventCreatedEvent, MbscEventDeletedEvent, MbscEventUpdatedEvent} from '@mobiscroll/vue';
import {acceptHMRUpdate, defineStore} from 'pinia';
import {createFetch, useLocalStorage} from '@vueuse/core';
import {fetchAccessToken, fetchAuthCode, refreshAccessToken} from '~/utils/googleCalendar';
import {formatGcalEvent, formatMbscEvent} from '~/models/Event';
import {getTimeOfDay} from '~/utils/date';
import {useStorageLocal} from '~/utils/useStorageLocal';

export const useCalendarStore = defineStore('calendar', () => {
    /**
     * There are 3 possible states:
     * null -> user hasn't decided to connect or not
     * empty string '' -> user has chosen to disconnect
     * non-empty string ->  user has chosen to connnect
     */
    const authToken = useLocalStorage<string | null>('gcalAuthToken', null);

    const refreshToken = useLocalStorage<string | null>('gcalRefreshToken', null);

    /**
     * The email account who owns the calendars.
     */
    const calendarEmail = useLocalStorage<string>('calendarEmail', '');

    const events = useStorageLocal<Event[]>('events', []);

    async function getAuthToken() {
        if (refreshToken.value) {
            authToken.value = await refreshAccessToken(refreshToken.value);
        }
        else {
            const code = await fetchAuthCode();

            const tokens = await fetchAccessToken(code);

            authToken.value = tokens.access_token;

            if (tokens.refresh_token)
                refreshToken.value = tokens.refresh_token;
        }
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
            async onFetchError(ctx) {
                // If error because authToken expired, refresh the authToken.
                if (ctx.response?.status === 401)
                    await getAuthToken();

                return ctx;
            },
        },
    });

    async function fetchGcalEvents(calendarId: string = 'primary') {
        // Store local events (unsynced) to Gcal.
        const localEvents = events.value.filter(e => e.id.startsWith('_'));
        for (const localEvent of localEvents)
            await storeGcalEvent(localEvent);

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

    async function storeGcalEvent(event: Event) {
        const key = event.allDay ? 'date' : 'dateTime';

        return await useGcalApi('calendars/primary/events').post({
            summary: event.title,
            start: {[key]: event.start},
            end: {[key]: event.end},
        }).json<GcalEvent>();
    }

    async function createEvent(args: MbscEventCreatedEvent) {
        const localEvent = formatMbscEvent(args.event);
        localEvent.id = generateEventId();

        if (authToken.value) {
            const result = await storeGcalEvent(localEvent);

            if (!result.error.value && result.data.value)
                // Set gcal generated id to the event instance.
                localEvent.id = result.data.value.id!;
        }

        args.event.id = localEvent.id;
        events.value.push(localEvent);
    }

    async function updateEvent(args: MbscEventUpdatedEvent) {
        const event = formatMbscEvent(args.event);

        if (authToken.value) {
            await useGcalApi(`calendars/primary/events/${event.id}`).patch({
                start: {
                    date: event.allDay ? event.start : null,
                    dateTime: event.allDay ? null : event.start,
                },
                end: {
                    date: event.allDay ? event.end : null,
                    dateTime: event.allDay ? null : event.end,
                },
            }).json();
        }
    }

    async function deleteEvent(args: MbscEventDeletedEvent) {
        const id = args.event.id;

        if (!id)
            return;

        // Delete the event from local events.
        events.value = events.value.filter(e => e.id !== id);

        if (authToken.value)
            await useGcalApi(`calendars/primary/events/${id}`).delete();
    }

    return {
        authToken,
        refreshToken,
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
