<script setup lang="ts">
import {useDateFormat, useNow} from '@vueuse/core';
import {useTasksStore, useTrashStore} from '~/stores';
import type ContextMenuItem from '~/models/ContextMenuItem';
import type Task from '~/models/Task';
import {getTomorrow} from '~/utils/date';

defineProps({
    parentElement: {
        type: Object as PropType<HTMLElement | null>,
        default: null,
    },
});

const task = defineModel<Task>({required: true});

const {editTask, moveTask, scheduleTask} = useTasksStore();
const {removeTasks} = useTrashStore();

const {t} = useI18n();

const currentDate = useNow();
const tomorrowsDate = useDateFormat(getTomorrow(), 'YYYY-MM-DD'); ;

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
                    action: () => scheduleTask(task.value, 'today'),
                    selected: computed(() => (task.value.scheduledFor != null && new Date(task.value.scheduledFor) <= currentDate.value)),
                },
                {
                    icon: 'schedule',
                    text: t('sidebar.tomorrow'),
                    action: () => scheduleTask(task.value, 'tomorrow'),
                    selected: computed(() => (task.value.scheduledFor === tomorrowsDate.value)),
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
