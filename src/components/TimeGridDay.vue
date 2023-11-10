<script setup lang="ts">
import interactionPlugin, {Draggable} from '@fullcalendar/interaction';
import {onClickOutside, useDateFormat} from '@vueuse/core';
import type {CalendarOptions} from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/vue3';
import {getDuration} from '~/utils/date';
import {onKeyStroke} from '~/utils/onKeyStroke';
import {storeToRefs} from 'pinia';
import timeGridPlugin from '@fullcalendar/timegrid';
import {useCalendarStore} from '~/stores';

const {events} = storeToRefs(useCalendarStore());
const {createEvent, deleteEvent, updateEvent} = useCalendarStore();

const card = ref(null);

const selectedEventId = ref('');
onClickOutside(card, () => selectedEventId.value = '');

onKeyStroke('Backspace', () => {
    if (selectedEventId.value)
        deleteEvent(selectedEventId.value);
});

const options: ComputedRef<CalendarOptions> = computed(() => ({
    events: events.value.map((e) => {
        const isSelected = e.id === selectedEventId.value;

        return {
            ...e,
            extendedProps: {
                isSelected,
            },
        };
    }),
    allDayContent: '',
    allDaySlot: true,
    buttonText: {today: 'Today'},
    dayHeaders: false,
    droppable: true,
    editable: true,
    eventChange: ({event}) => { updateEvent(event); },
    eventClick: ({event}) => { selectedEventId.value = event.id; },
    eventReceive: ({event}) => { createEvent(event); },
    expandRows: true,
    headerToolbar: {
        start: 'title',
        center: '',
        end: '',
    },
    height: '100%',
    initialView: 'timeGridDay',
    nowIndicator: true,
    plugins: [interactionPlugin, timeGridPlugin],
    scrollTime: useDateFormat(new Date(), 'HH:00').value,
    slotDuration: '00:15:00',
    slotLabelFormat: {
        hour12: false,
        hour: 'numeric',
        minute: '2-digit',
        omitZeroMinute: true,
    },
    slotLabelInterval: '01:00:00',
    titleFormat: ({date}) => useDateFormat(date.marker, 'DD MMM').value,
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
        >
            <template #eventContent="{event}">
                <div
                    class="h-full items-center justify-between border border-gray-850 rounded-md [.fc-timegrid-event-short_&]:flex [.fc-timegrid-event-short_&]:pt-0"
                    :class="event.extendedProps.isSelected ? 'bg-blueberry-600' : 'bg-blueberry-700 hover:bg-blueberry-650'"
                    p="x-2 t-1"
                >
                    <div
                        class="truncate text-2sm font-medium"
                        :class="event.extendedProps.isSelected ? 'text-blueberry-200' : 'text-blueberry-200/80'"
                    >
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
        </FullCalendar>

        <Suspense>
            <CalendarConnectCard
                ref="card"
                class="absolute bottom-0 right-0 z-10"
            />
        </Suspense>
    </div>
</template>

<style>
:root {
    --fc-neutral-bg-color: theme('colors.gray.600');
    --fc-border-color: theme('colors.gray.600');
    --fc-now-indicator-color: theme('colors.red.500');
    --fc-page-bg-color: transparent;
    --fc-today-bg-color: transparent;

    --fc-button-bg-color: theme('colors.gray.800');
    --fc-button-hover-bg-color: theme('colors.gray.750');
    --fc-button-active-bg-color: theme('colors.gray.750');
    --fc-button-text-color: theme('colors.gray.400');
    --fc-button-border-color: transparent;
    --fc-button-hover-border-color: transparent;
    --fc-button-active-border-color: transparent;

    --fc-event-bg-color: transparent;
    --fc-event-border-color: transparent;
    --fc-event-resizer-thickness: 1rem;
}

.fc {
    & .fc-toolbar-title {
        @apply text-sm text-gray-400 font-medium;
    }

    & .fc-button {
        @apply text-2sm p-1 focus:shadow-none!;
    }

    & .fc-today-button {
        @apply px-2;
    }

    & .fc-scrollgrid, td, th {
        @apply border-none;
    }

    & .fc-timegrid-divider {
        @apply p-0;
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

    & .fc-timegrid-event-harness {
        @apply -translate-y-px;
    }

    & .fc-timegrid-event {
        @apply mb-0;
    }

    & .fc-event-main {
        @apply p-0 h-full;
    }

    & .fc-timegrid-slot-minor {
        @apply border-t-none;
    }
}
</style>
