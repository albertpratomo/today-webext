<script setup lang="ts">
import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/vue';
import {useDateFormat, useNow} from '@vueuse/core';
import type Task from '~/models/Task';
import {getTomorrow} from '~/utils/date';
import {useTasksStore} from '~/stores';

const {scheduleTask} = useTasksStore();
const task = defineModel<Task>({required: true});

const {t} = useI18n();

const currentDate = useNow();
const tomorrowsDate = useDateFormat(getTomorrow(), 'YYYY-MM-DD'); ;

const menu = [
    {
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
    },
];

const currentBucket = computed(() => menu[0].items.find(item => item.selected.value === true));
</script>

<template>
    <Menu as="div">
        <MenuButton
            as="div"
            class="flex"
        >
            <Button
                size="xs"
                variant="secondary"
            >
                <svg
                    fill="none"
                    height="16"
                    viewBox="0 0 16 16"
                    width="16"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect
                        height="11.5"
                        rx="2.25"
                        stroke="#AAAAB8"
                        stroke-width="1.5"
                        width="12.5"
                        x="1.75"
                        y="1.75"
                    />

                    <rect
                        fill="#AAAAB8"
                        height="2"
                        width="12"
                        x="2"
                        y="2"
                    />

                    <rect
                        fill="#AAAAB8"
                        height="1.41421"
                        transform="rotate(-45 10 10)"
                        width="1.41421"
                        x="10"
                        y="10"
                    />

                    <rect
                        fill="#AAAAB8"
                        height="1.41421"
                        transform="rotate(-45 7 10)"
                        width="1.41421"
                        x="7"
                        y="10"
                    />
                </svg>
                {{ currentBucket?.text }}
            </Button>
        </MenuButton>

        <MenuItems class="absolute z-10 ma-1 w-40 flex flex-col border border-color-[#39394D] rounded bg-gray-800 p-1 text-xs shadow-sm">
            <div
                v-for="(categories, i) in menu"
                :key="i"
            >
                <div class="p-[6px] text-gray-400">
                    {{ categories.text }}
                </div>

                <MenuItem
                    v-for="(item, ii) in categories.items"
                    :key="ii"
                    v-slot="{active}"
                >
                    <button
                        class="block w-full flex rounded p-2 pl-[2px] text-left"
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
            </div>
        </MenuItems>
    </Menu>
</template>
