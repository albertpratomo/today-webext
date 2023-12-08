<script setup lang="ts">
import type {Event} from '~/models/Event';
import {getDuration} from '~/utils/date';
import {getEventColor} from '~/utils/googleCalendarColors';

const {event} = defineProps<{event: Event}>();

const color = getEventColor('5');

const cssVariables = {
    '--text': color[200],
    '--active-bg': color[600],
    '--hover-bg': color[650],
    '--bg': color[700],
};

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
        class="h-full items-center justify-between border-r border-gray-850 rounded px-2"
        :class="_class"
        :style="cssVariables"
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
</template>
