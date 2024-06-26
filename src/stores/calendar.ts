import {type Event, type GcalEvent, generateEventId} from '~/models/Event';
import {acceptHMRUpdate, defineStore, storeToRefs} from 'pinia';
import {createFetch, useLocalStorage} from '@vueuse/core';
import {fetchAccessToken, fetchAuthCode, refreshAccessToken} from '~/utils/googleCalendar';
import {formatGcalEvent, formatMbscEvent} from '~/models/Event';
import type {MbscEventCreatedEvent} from '@mobiscroll/vue';
import {getTimeOfDay} from '~/utils/date';
import {i18n} from '~/i18n';
import {notify} from 'notiwind';
import {trackGa} from '~/utils/googleAnalytics';
import {useStorageLocal} from '~/utils/useStorageLocal';
import {useTasksStore} from '~/stores';

export const useCalendarStore = defineStore('calendar', () => {
    const {addTaskEventId, deleteTaskEventId} = useTasksStore();
    const {tasks} = storeToRefs(useTasksStore());
    const calendarIsVisible = useLocalStorage<boolean>('calendarIsVisible', true);
    /**
     * There are 3 possible states:
     * null -> user hasn't decided to connect or not
     * empty string '' -> user has chosen to disconnect
     * non-empty string ->  user has chosen to connnect
     */
    const authToken = useLocalStorage<string | null>('gcalAuthToken', null);

    const refreshToken = useLocalStorage<string | null>('gcalRefreshToken', null);

    const calendarColorId = useLocalStorage<string | undefined>('calendarColorId', undefined);

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

                url += `${url.includes('?') ? '&' : '?'}key=GCAL_API_KEY`;

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
        // TODO: This should be handled by BE.
        const localEvents = events.value.filter(e => e.id.startsWith('_'));
        for (const localEvent of localEvents) {
            const result = await storeGcalEvent(localEvent);
            if (!result.error.value && result.data.value) {
                // Updating the task.eventIds: replacing local event id with Gcal id after sync.
                const gcalEventId = result.data.value.id!;

                // TODO: This should be handled by BE.
                for (const task of tasks.value) {
                    if (task.eventIds !== undefined && task.eventIds !== null) {
                        const index = task.eventIds.indexOf(localEvent.id);
                        if (index !== -1)
                            task.eventIds[index] = gcalEventId;
                    }
                }
            }
        }

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

            fetchGcalCalendarColorId();
        }

        return result;
    }

    async function fetchGcalCalendarColorId() {
        const {data} = await useGcalApi('users/me/calendarList/primary').get().json();

        calendarColorId.value = data.value.colorId;
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

        // Use `concat` instead of `push` to trigger <MbscEventcalendar> to rerender.
        events.value = events.value.concat([localEvent]);

        args.event.id = localEvent.id;

        addTaskEventId(args.event.task, localEvent);

        if (authToken.value) {
            const result = await storeGcalEvent(localEvent);

            if (!result.error.value && result.data.value) {
                // Remove local generated id
                deleteTaskEventId(localEvent.id);

                // Set gcal generated id to the event instance.
                localEvent.id = result.data.value.id!;

                addTaskEventId(args.event.task, localEvent);
            }
        }

        trackGa('event_created');
    }

    async function updateGcalEvent(event: Event) {
        if (authToken.value) {
            // Always send updates to attendees.
            await useGcalApi(`calendars/primary/events/${event.id}?sendUpdates=all`).patch({
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

    async function deleteEvent(event: Event) {
        // Delete the event from local events.
        events.value = events.value.filter(e => e.id !== event.id);
        deleteTaskEventId(event.id);

        notify({
            group: 'general',
            text: i18n.t('events.eventDeletedMessage', {title: event.title}),
            isCloseable: true,
        });

        if (authToken.value)
            await useGcalApi(`calendars/primary/events/${event.id}?sendUpdates=all`).delete();
    }

    return {
        calendarIsVisible,

        authToken,
        refreshToken,
        calendarColorId,
        calendarEmail,
        events,

        createEvent,
        deleteEvent,
        fetchGcalEvents,
        getAuthToken,
        updateGcalEvent,
    };
});

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useCalendarStore, import.meta.hot));
