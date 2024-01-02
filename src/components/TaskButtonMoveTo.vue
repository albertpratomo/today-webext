<script setup lang="ts">
import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/vue';
import type Task from '~/models/Task';
import {useTasksStore} from '~/stores';

const {moveTask} = useTasksStore();
const task = defineModel<Task>({required: true});

const isActionable = computed(() => !task.value.deletedAt && !task.value.isDone);

const {t} = useI18n();

const menu = {
    text: t('tasks.contextMenu.buckets'),
    items: [
        {
            icon: 'inbox',
            text: t('sidebar.inbox'),
            action: () => moveTask(task.value, 'inbox', {showToast: false}),
            selected: computed(() => (task.value.projectId === 'inbox')),
        },
        {
            icon: 'active',
            text: t('sidebar.active'),
            action: () => moveTask(task.value, 'active', {showToast: false}),
            selected: computed(() => (task.value.projectId !== 'inbox' && (task.value.scheduledFor === null || task.value.scheduledFor !== 'later'))),
        },
        {
            icon: 'later',
            text: t('sidebar.later'),
            action: () => moveTask(task.value, 'later', {showToast: false}),
            selected: computed(() => (task.value.scheduledFor === 'later')),
        },
    ],
};

const currentBucket = computed(() => menu.items.find(item => item.selected.value === true));
</script>

<template>
    <Menu as="div">
        <MenuButton
            as="div"
            class="text-indigo-400"
            :disabled="!isActionable"
        >
            <Button
                :disabled="!isActionable"
                size="xs"
                variant="secondary"
            >
                <Icon
                    v-if="currentBucket?.icon"
                    :name="currentBucket.icon"
                />
                {{ currentBucket?.text }}
            </Button>
        </MenuButton>

        <MenuItems class="absolute z-10 mt-1 w-40 flex flex-col border border-color-[#39394D] rounded bg-gray-800 p-1 text-xs shadow-sm">
            <div class="p-[6px] text-gray-400">
                {{ menu.text }}
            </div>

            <MenuItem
                v-for="(item, j) in menu.items"
                :key="j"
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
        </MenuItems>
    </Menu>
</template>
