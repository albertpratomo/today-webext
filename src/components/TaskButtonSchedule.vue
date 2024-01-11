<script setup lang="ts">
import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/vue';
import {useDateFormat, useNow} from '@vueuse/core';
import type Task from '~/models/Task';
import {getTomorrow} from '~/utils/date';
import {useTasksStore} from '~/stores';

const {scheduleTask} = useTasksStore();
const task = defineModel<Task>({required: true});

const isActionable = computed(() => !task.value.deletedAt && !task.value.isDone);

const {t} = useI18n();

const currentDate = useNow();
const tomorrowsDate = useDateFormat(getTomorrow(), 'YYYY-MM-DD'); ;

const menu = {
    text: t('actions.schedule'),
    items: [
        {
            icon: 'schedule',
            text: t('sidebar.today'),
            action: () => scheduleTask(task.value, 'today', false),
            selected: computed(() => (task.value.scheduledFor != null && new Date(task.value.scheduledFor) <= currentDate.value)),
        },
        {
            icon: 'schedule',
            text: t('sidebar.tomorrow'),
            action: () => scheduleTask(task.value, 'tomorrow', false),
            selected: computed(() => (task.value.scheduledFor === tomorrowsDate.value)),
        },
    ],
};

const currentBucket = computed(() => menu.items.find(item => item.selected.value === true));
</script>

<template>
    <Menu as="div">
        <MenuButton
            as="div"
            class="flex"
            :disabled="!isActionable"
        >
            <Button
                :disabled="!isActionable"
                size="xs"
                variant="secondary"
            >
                <Icon name="schedule" />

                {{ currentBucket?.text }}
            </Button>
        </MenuButton>

        <MenuItems class="absolute z-10 ma-1 w-40 flex flex-col border border-gray-700 rounded bg-gray-800 p-1 text-xs shadow-sm">
            <div class="p-1.5 text-gray-400">
                {{ menu.text }}
            </div>

            <MenuItem
                v-for="(item, j) in menu.items"
                :key="j"
                v-slot="{active}"
            >
                <button
                    class="block w-full flex rounded p-2 pl-0.5 text-left"
                    :class="{'bg-gray-750': active}"
                    @click="item.action"
                >
                    <div class="mr-1 h-4 w-4 flex items-center text-gray-400">
                        <MaterialSymbolsCheck v-if="item.selected.value" />
                    </div>

                    <Icon
                        v-if="item.icon"
                        class="mr-2"
                        :name="item.icon"
                    />

                    {{ item.text }}
                </button>
            </MenuItem>
        </MenuItems>
    </Menu>
</template>
