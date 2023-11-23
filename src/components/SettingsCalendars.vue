<script setup lang="ts">
import {revokeToken} from '~/utils/gcal';
import {storeToRefs} from 'pinia';
import {useCalendarStore} from '~/stores';

const {authToken, refreshToken, calendarEmail} = storeToRefs(useCalendarStore());
const {getAuthToken, fetchGcalEvents} = useCalendarStore();

async function connect() {
    await getAuthToken();

    fetchGcalEvents();
}

function disconnect() {
    chrome.identity.removeCachedAuthToken({token: authToken.value!});
    revokeToken(authToken.value!);

    authToken.value = '';
    refreshToken.value = '';
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
