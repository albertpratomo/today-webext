<script setup lang="ts">
import {notify} from 'notiwind';
import {revokeToken} from '~/utils/googleCalendar';
import {storeToRefs} from 'pinia';
import {useCalendarStore} from '~/stores';

const {authToken, refreshToken, calendarEmail} = storeToRefs(useCalendarStore());
const {getAuthToken, fetchGcalEvents} = useCalendarStore();

const {t} = useI18n();

async function connect() {
    await getAuthToken();

    const response = await fetchGcalEvents();

    if (!response.error.value && response.data.value) {
        notify({
            group: 'general',
            text: t('settingsCalendars.gcal.connect.successMessage'),
            isCloseable: true,
        }, 4000);
    }
}

function disconnect() {
    chrome.identity.removeCachedAuthToken({token: authToken.value!});
    revokeToken(authToken.value!);

    // Set authToken to null, so CalendarConnectCard is shown again.
    authToken.value = null;
    refreshToken.value = null;
}
</script>

<template>
    <div>
        <h2 class="text-lg font-medium">
            {{ $t('settingsCalendars.title') }}
        </h2>

        <div class="mt-4 border-y py-4">
            <div class="flex items-center justify-between">
                <template v-if="authToken">
                    <div class="flex items-center gap-3 text-sm">
                        <LogosGoogleCalendar />

                        {{ calendarEmail }}
                    </div>

                    <div>
                        <Button
                            class="text-red-400"
                            variant="ghost"
                            @click="disconnect"
                        >
                            {{ $t('actions.remove') }}
                        </Button>
                    </div>
                </template>

                <template v-else>
                    <div>
                        <p class="text-sm font-medium">
                            {{ $t('settingsCalendars.gcal.connect.title') }}
                        </p>

                        <p class="text-2sm text-gray-350">
                            {{ $t('settingsCalendars.gcal.connect.subtitle') }}
                        </p>
                    </div>

                    <Button
                        variant="primary"
                        @click="connect"
                    >
                        {{ $t('actions.connect') }}
                    </Button>
                </template>
            </div>
        </div>
    </div>
</template>
