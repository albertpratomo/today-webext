import {acceptHMRUpdate, defineStore} from 'pinia';
import {createFetch, useLocalStorage} from '@vueuse/core';
import {type calendar_v3} from '@googleapis/calendar';

function getTimeOfDay(type = 'start') {
    const date = new Date();

    if (type === 'start')
        date.setHours(0, 0, 0, 0);
    else
        date.setHours(23, 59, 59, 999);

    return date.toISOString();
}

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
            async beforeFetch({options}) {
                if (!authToken.value)
                    await getAuthToken();

                options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${authToken.value}`,
                };

                return {options};
            },
        },
    });

    async function getEvents(calendarId: string = 'primary') {
        const params = new URLSearchParams({
            key: 'AIzaSyC2G-xvTc95LDqX1SCEhdyh0Z9_uipiqdo',
            timeMin: getTimeOfDay('start'),
            timeMax: getTimeOfDay('end'),
            singleEvents: 'true',
        });

        const result = await useGcalApi<{items: calendar_v3.Schema$Event[]}>(
            `calendars/${calendarId}/events?${params.toString()}`,
        ).json();

        if (!result.error.value)
            todayEvents.value = result.data.value.items;

        return result;
    }

    return {
        authToken,
        getAuthToken,
        getEvents,
        todayEvents,
    };
});

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useCalendarStore, import.meta.hot));
