<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useCalendarStore} from '~/stores';

const isVisible = ref(true);

const {authToken} = storeToRefs(useCalendarStore());
const {getAuthToken, fetchGcalEvents} = useCalendarStore();

if (authToken.value) {
    isVisible.value = false;

    _getEvents();
}

async function _getEvents() {
    const {error} = await fetchGcalEvents();

    isVisible.value = !!error.value;
}

async function connect() {
    await getAuthToken();

    _getEvents();
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
                @click="isVisible = false"
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
