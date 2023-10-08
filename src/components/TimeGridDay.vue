<script setup lang="ts">
import interactionPlugin, {Draggable} from '@fullcalendar/interaction';
import type {CalendarOptions} from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/vue3';
import {storeToRefs} from 'pinia';
import timeGridPlugin from '@fullcalendar/timegrid';
import {useCalendarStore} from '~/stores';

const {todayEvents} = storeToRefs(useCalendarStore());

const options: ComputedRef<CalendarOptions> = computed(() => ({
    events: todayEvents.value.map(e => ({
        title: e.summary || undefined,
        start: e.start?.dateTime || e.start?.date || undefined,
        end: e.end?.dateTime || e.end?.date || undefined,
    })),
    allDaySlot: true,
    dayHeaders: false,
    droppable: true,
    editable: true,
    expandRows: true,
    headerToolbar: false,
    height: '100%',
    initialView: 'timeGridDay',
    plugins: [interactionPlugin, timeGridPlugin],
    scrollTime: '05:50',
    slotLabelFormat: {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        omitZeroMinute: false,
    },
}));

onMounted(() => {
    const taskListEl = document.getElementById('undone-task-list');

    if (taskListEl) {
        // eslint-disable-next-line no-new
        new Draggable(taskListEl, {
            itemSelector: '.task-item',
            eventData(taskItemEl: HTMLElement) {
                return {
                    title: taskItemEl.innerText,
                    duration: '01:00',
                };
            },
        });
    }
});
</script>

<template>
    <div class="relative h-full">
        <FullCalendar
            class="text-gray-400"
            :options="options"
        />

        <Suspense>
            <CalendarConnectCard class="absolute bottom-0 right-0 z-10" />
        </Suspense>
    </div>
</template>

<style>
:root {
    --fc-border-color: #3C3D53;
    --fc-now-indicator-color: #DC2626;
    --fc-today-bg-color: transparent;
}

.fc {
    & .fc-scrollgrid, td, th {
        @apply border-none;
    }

    & .fc-timegrid-slot-label-frame {
        @apply -mt-5 text-xs;
    }

    & .fc-timegrid-slot-label-cushion {
        @apply px-0 pr-2;
    }

    & .fc-timegrid-slot-lane:not(.fc-timegrid-slot-minor) {
        border-top: 1px solid var(--fc-border-color);
    }

    & .fc-timegrid-slot-minor {
        @apply border-t-none;
    }
}
</style>
