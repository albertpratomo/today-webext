<script setup lang="ts">
const isVisible = ref(true);
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
            {{ $t('gcalConnectCard.title') }}
        </div>

        <div class="text-xs text-gray-300">
            {{ $t('gcalConnectCard.body') }}
        </div>

        <button class="mt-4 btn-indigo">
            {{ $t('actions.connect') }}
        </button>
    </div>
</template>
