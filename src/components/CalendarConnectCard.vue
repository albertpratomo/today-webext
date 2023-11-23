<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useCalendarStore} from '~/stores';

const isVisible = ref(false);

const {authToken} = storeToRefs(useCalendarStore());
const {getAuthToken, fetchGcalEvents} = useCalendarStore();

if (authToken.value === null) {
    isVisible.value = true;
}
else if (authToken.value) {
    isVisible.value = false;

    _getEvents();
}

// TODO: This component shouldn't be responsible to fetch events. Just connect to Gcal.
async function _getEvents() {
    let response = await fetchGcalEvents();

    // If authToken expired, authToken is refreshed in `useGcalApi`, then try fetch events again.
    if (response.statusCode.value === 401)
        response = await fetchGcalEvents();

    isVisible.value = !!response.error.value;
}

async function connect() {
    await getAuthToken();

    _getEvents();
}

function close() {
    isVisible.value = false;
    authToken.value = '';
}
</script>

<template>
    <div
        v-if="isVisible"
        class="w-80 border rounded bg-gray-800 p-3 shadow-indigo-emerald"
    >
        <div class="flex items-center justify-between">
            <LogosGoogleCalendar />

            <button
                class="text-gray-300"
                @click="close"
            >
                <MaterialSymbolsClose />
            </button>
        </div>

        <div class="my-2 text-sm font-semibold leading-5">
            {{ $t('calendarConnectCard.title') }}
        </div>

        <div class="text-xs text-gray-300">
            {{ $t('calendarConnectCard.body') }}
        </div>

        <Button
            class="mt-4"
            variant="primary"
            @click="connect"
        >
            {{ $t('actions.connect') }}
        </Button>
    </div>
</template>
