<script setup lang="ts">
const connected = ref(true);
</script>

<template>
    <div>
        <h2 class="text-lg font-medium">
            {{ $t('settingsCalendars.title') }}
        </h2>

        <div class="mt-4 border-y py-4">
            <div class="flex items-center justify-between">
                <template v-if="connected">
                    <div>
                        <LogosGoogleCalendar />
                    </div>

                    <div>
                        <Button
                            class="text-red-400"
                            variant="ghost"
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

                    <Button variant="primary">
                        {{ $t('actions.connect') }}
                    </Button>
                </template>
            </div>
        </div>
    </div>
</template>
