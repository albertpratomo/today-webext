import {acceptHMRUpdate, defineStore} from 'pinia';
import {type calendar_v3} from '@googleapis/calendar';
import {useStorageLocal} from '~/utils/useStorageLocal';

function getTimeOfDay(type = 'start') {
    const date = new Date();

    if (type === 'start')
        date.setHours(0, 0, 0, 0);
    else
        date.setHours(23, 59, 59, 999);

    return date.toISOString();
}

export const useCalendarStore = defineStore('calendar', () => {
    const authToken = useStorageLocal<string>('calendarAuthToken', '');

    const todayEvents: Ref<calendar_v3.Schema$Event[]> = ref([]);

    async function getAuthToken() {
        const response = await chrome.identity.getAuthToken({
            interactive: true,
            scopes: [
                'https://www.googleapis.com/auth/calendar',
            ],
        });

        authToken.value = response.token;
    }

    async function getEvents(calendarId: string = 'primary') {
        const params = new URLSearchParams({
            key: 'AIzaSyC2G-xvTc95LDqX1SCEhdyh0Z9_uipiqdo',
            timeMin: getTimeOfDay('start'),
            timeMax: getTimeOfDay('end'),
        });

        const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${params.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${authToken.value}`,
                },
            },
        );

        todayEvents.value = (await response.json()).items;
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
