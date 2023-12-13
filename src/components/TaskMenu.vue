<script setup lang="ts">
import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/vue';
import {useDateFormat, useNow} from '@vueuse/core';
import type Task from '~/models/Task';
import {getTomorrow} from '~/utils/date';
import {useTasksStore} from '~/stores';

const {moveTask, scheduleTask} = useTasksStore();
const task = defineModel<Task>({required: true});

const {t} = useI18n();

const currentDate = useNow();
const tomorrowsDate = useDateFormat(getTomorrow(), 'YYYY-MM-DD'); ;

const menu = [
    {
        text: 'Move to',
        submenu: {
            text: 'Buckets',
            items: [
                {
                    icon: 'inbox',
                    text: t('sidebar.inbox'),
                    destination: 'inbox',
                    action: moveTask,
                    selected: (task.value.projectId === 'inbox'),
                },
                {
                    icon: 'active',
                    text: t('sidebar.active'),
                    destination: 'active',
                    action: moveTask,
                    selected: (task.value.projectId !== 'inbox' && (task.value.scheduledFor === null || task.value.scheduledFor !== 'later')),
                },
                {
                    icon: 'later',
                    text: t('sidebar.later'),
                    destination: 'later',
                    action: moveTask,
                    selected: (task.value.scheduledFor === 'later'),
                },
            ],
        },
    },
    {
        text: 'Schedule',
        submenu: {
            text: 'Schedule',
            items: [
                {
                    text: t('sidebar.today'),
                    destination: 'today',
                    action: scheduleTask,
                    selected: (task.value.scheduledFor != null && new Date(task.value.scheduledFor) <= currentDate.value),
                },
                {
                    text: t('sidebar.tomorrow'),
                    destination: 'tomorrow',
                    action: scheduleTask,
                    selected: (task.value.scheduledFor === tomorrowsDate.value),
                },
            ],
        },
    },
];
</script>

<template>
    <Menu
        v-slot="{open}"
        as="div"
        class="relative inline-block"
    >
        <MenuButton class="p-1 text-indigo-400">
            <MaterialSymbolsShareWindows />
        </MenuButton>

        <MenuItems
            class="absolute w-40 flex flex-col border border-color-[#39394D] rounded bg-gray-800 p-1"
            :class="{'z-100': open}"
        >
            <MenuItem
                v-for="(item, i) in menu"
                :key="i"
                v-slot="{active}"
                class="relative"
            >
                <button
                    class="rounded p-2 text-left text-xs text-gray-300"
                    :class="[
                        active ? 'bg-gray-750' : '',
                    ]"
                >
                    {{ item.text }}

                    <Transition name="fade-up">
                        <div
                            v-show="active"
                            class="absolute left-full top-0 min-w-40 border border-color-[#39394D] rounded bg-gray-800 p-1 text-gray-200"
                        >
                            <div class="p-[6px] text-gray-400">
                                {{ item.submenu.text }}
                            </div>

                            <button
                                v-for="(submenuItem, ii) in item.submenu.items"
                                :key="ii"
                                class="block w-full flex p-2 pl-[2px] text-left"
                                @click="submenuItem.action(task, submenuItem.destination)"
                            >
                                <div class="mr-1 h-4 w-4 flex items-center text-xs text-gray-400">
                                    <MaterialSymbolsCheck v-if="submenuItem.selected" />
                                </div>

                                <Icon
                                    v-if="submenuItem.icon"
                                    class="mr-2"
                                    :name="submenuItem.icon"
                                />

                                {{ submenuItem.text }}
                            </button>
                        </div>
                    </Transition>
                </button>
            </MenuItem>
        </MenuItems>
    </Menu>
</template>
