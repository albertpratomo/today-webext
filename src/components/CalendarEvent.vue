<script setup lang="ts">
import type {Event} from '~/models/Event';
import {getDuration} from '~/utils/date';
import {getEventColor} from '~/utils/googleCalendarColors';

const {event} = defineProps<{event: Event}>();

const cssVariables = computed(() => {
    const color = getEventColor(event.colorId);

    return {
        '--text': color[200],
        '--active-bg': color[600],
        '--hover-bg': color[650],
        '--bg': color[700],
    };
});

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
        bg="[--bg] hover:[--hover-bg] [.mbsc-schedule-event-active_&]:[--active-bg]!"
        class="h-full border-r border-gray-850 rounded"
        :style="cssVariables"
    >
        <div
            class="items-center justify-between px-2"
            :class="_class"
            un-opacity="75 [.mbsc-schedule-event-active_&]:100"
        >
            <div class="truncate text-2sm font-medium text-[--text]">
                {{ event.title }}
            </div>

            <div
                v-if="!event.allDay"
                class="text-xs text-[--text] opacity-60"
            >
                {{ getDuration(event.start, event.end) }}
            </div>
        </div>
    </div>
</template>
