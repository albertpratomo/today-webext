<script setup lang="ts">
import type {Event} from '~/models/Event';
import {getDuration} from '~/utils/date';

const {event} = defineProps<{event: Event}>();

const _class = computed(() => {
    if (event.allDay)
        return '';

    const duration = getDuration(event.start, event.end);

    switch (duration) {
        case '15m': return 'flex';
        case '30m': return 'pt-.5';
        default: return 'pt-1';
    }
});
</script>

<template>
    <div
        bg="blueberry-700 hover:blueberry-650 [.mbsc-schedule-event-active_&]:blueberry-600!"
        class="h-full items-center justify-between border-r border-gray-850 rounded px-2"
        :class="_class"
    >
        <div class="truncate text-2sm font-medium text-blueberry-200">
            {{ event.title }}
        </div>

        <div
            v-if="!event.allDay"
            class="text-xs text-blueberry-200/60"
        >
            {{ getDuration(event.start, event.end) }}
        </div>
    </div>
</template>
