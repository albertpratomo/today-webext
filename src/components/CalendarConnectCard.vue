<script setup lang="ts">
import {useCalendarStore} from '~/stores';

const isVisible = ref(true);

const {getAuthToken, getEvents} = useCalendarStore();

async function connect() {
    await getAuthToken();

    getEvents();

    isVisible.value = false;
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
