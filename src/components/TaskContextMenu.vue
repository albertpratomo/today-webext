<script setup lang="ts">
import {useDateFormat, useNow} from '@vueuse/core';
import {useTasksStore, useTrashStore} from '~/stores';
import {type ContextMenuItem} from '~/components/ContextMenu.vue';
import type Task from '~/models/Task';
import {getTomorrow} from '~/utils/date';

interface Props {
    parentElement: HTMLElement | null
}

defineProps<Props>();

const task = defineModel<Task>({required: true});

const {editTask, moveTask, scheduleTask} = useTasksStore();
const {removeTasks} = useTrashStore();

const {t} = useI18n();

const currentDate = useNow({interval: 5000});
const tomorrowDate = useDateFormat(getTomorrow(), 'YYYY-MM-DD');

const todayIsSelected = computed(() => (task.value.scheduledFor != null && new Date(`${task.value.scheduledFor} 00:00:00`) <= currentDate.value));
const tomorrowIsSelected = computed(() => (task.value.scheduledFor === tomorrowDate.value));

const menuItems: ContextMenuItem[] = [
    {
        text: t('actions.moveTo'),
        submenu: {
            text: t('tasks.contextMenu.buckets'),
            items: [
                {
                    icon: 'inbox',
                    text: t('sidebar.inbox'),
                    action: () => moveTask(task.value, 'inbox'),
                    selected: computed(() => (task.value.projectId === 'inbox')),
                },
                {
                    icon: 'active',
                    text: t('sidebar.active'),
                    action: () => moveTask(task.value, 'active'),
                    selected: computed(() => (task.value.projectId !== 'inbox' && (task.value.scheduledFor === null || task.value.scheduledFor !== 'later'))),
                },
                {
                    icon: 'later',
                    text: t('sidebar.later'),
                    action: () => moveTask(task.value, 'later'),
                    selected: computed(() => (task.value.scheduledFor === 'later')),
                },
            ],
        },
    },
    {
        text: t('actions.schedule'),
        submenu: {
            items: [
                {
                    icon: 'schedule',
                    text: t('sidebar.today'),
                    shortcut: 'T',
                    action: () => scheduleTask(task.value, (todayIsSelected.value ? 'unschedule' : 'today')),
                    selected: todayIsSelected,
                },
                {
                    icon: 'schedule',
                    text: t('sidebar.tomorrow'),
                    action: () => scheduleTask(task.value, (tomorrowIsSelected.value ? 'unschedule' : 'tomorrow')),
                    selected: tomorrowIsSelected,
                },
            ],
        },
    },
    {
        text: t('actions.edit'),
        action: () => editTask(task.value),
    },
    {
        divider: true,
        text: t('actions.delete'),
        action: () => removeTasks([task.value.id]),
    },
];
</script>

<template>
    <ContextMenu
        :menu-items="menuItems"
        :parent-element="parentElement"
    />
</template>
