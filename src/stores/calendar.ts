import {acceptHMRUpdate, defineStore} from 'pinia';
import {createFetch, useLocalStorage} from '@vueuse/core';
import {type EventApi as FcEvent} from '@fullcalendar/core';
import {type calendar_v3} from '@googleapis/calendar';
import {getTimeOfDay} from '~/utils/date';

export const useCalendarStore = defineStore('calendar', () => {
    const authToken = useLocalStorage<string>('calendarAuthToken', '');

    const todayEvents: Ref<calendar_v3.Schema$Event[]> = ref([]);

    async function getAuthToken() {
        const response = await chrome.identity.getAuthToken({
            interactive: true,
            scopes: ['https://www.googleapis.com/auth/calendar'],
        });

        authToken.value = response.token;
    }

    const useGcalApi = createFetch({
        baseUrl: 'https://www.googleapis.com/calendar/v3',
        options: {
            async beforeFetch({url, options}) {
                if (!authToken.value)
                    await getAuthToken();

                options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${authToken.value}`,
                };

                url += `${url.includes('?') ? '&' : '?'}key=AIzaSyC2G-xvTc95LDqX1SCEhdyh0Z9_uipiqdo`;

                return {url, options};
            },
        },
    });

    async function getEvents(calendarId: string = 'primary') {
        const params = new URLSearchParams({
            timeMin: getTimeOfDay(new Date(), 'start'),
            timeMax: getTimeOfDay(new Date(), 'end'),
            singleEvents: 'true',
        });

        const result = await useGcalApi<{items: calendar_v3.Schema$Event[]}>(
            `calendars/${calendarId}/events?${params.toString()}`,
        ).json();

        if (!result.error.value)
            todayEvents.value = result.data.value.items;

        return result;
    }

    async function createEvent(event: FcEvent) {
        const result = await useGcalApi('calendars/primary/events').post({
            summary: event.title,
            start: {dateTime: event.startStr},
            end: {dateTime: event.endStr},
        }).json();

        // Set gcal generated id to the event instance.
        event.setProp('id', result.data.value.id);

        todayEvents.value.push(result.data.value);

        return result;
    }

    async function updateEvent(event: FcEvent) {
        const result = await useGcalApi(`calendars/primary/events/${event.id}`).patch({
            start: {dateTime: event.startStr},
            end: {dateTime: event.endStr},
        }).json();

        // Update todayEvents with the updated event.
        const index = todayEvents.value.findIndex(e => e.id === event.id);
        todayEvents.value[index] = result.data.value;

        return result;
    }

    async function deleteEvent(id: string) {
        const result = await useGcalApi(`calendars/primary/events/${id}`).delete();

        // Delete the event from todayEvents.
        todayEvents.value = todayEvents.value.filter(e => e.id !== id);

        return result;
    }

    return {
        authToken,
        createEvent,
        deleteEvent,
        getAuthToken,
        getEvents,
        todayEvents,
        updateEvent,
    };
});

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useCalendarStore, import.meta.hot));
