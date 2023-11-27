<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useTrashStore} from '~/stores';

const emit = defineEmits(['toggleSidebar']);

const {t} = useI18n();
const {tasks} = storeToRefs(useTrashStore());

const items = computed(() => {
    const items = [
        {
            icon: 'inbox',
            text: t('inbox'),
            to: {name: 'inbox'},
            isVisible: true,
        },
        {
            icon: 'today',
            text: t('today'),
            to: {name: 'today'},
            isVisible: true,
        },
        {
            icon: 'calendar',
            text: t('calendar'),
            to: null,
            isVisible: true,
        },
        {
            icon: 'later',
            text: t('later'),
            to: null,
            isVisible: true,
        },
        {
            icon: 'trash',
            text: t('trash'),
            to: {name: 'trash'},
            isVisible: !!tasks.value.length,
        },
    ];

    return items.filter(i => i.isVisible);
});

const isSettingsOpen = ref(false);
</script>

<template>
    <div class="fixed bottom-1.5 top-1.5 z-10 mr-1.5 w-[220px] flex flex-col border border-gray-200/16 rounded-[6px] bg-gray-900 px-2 pb-2 pt-8 lg:relative lg:bottom-0 lg:top-0 md:w-56 lg:border-transparent lg:px-1.5 lg:pb-1">
        <Button
            v-tippy="{
                content: $t('tooltips.toggleSidebar'),
                placement: 'right',
                offset: [0, 6],
            }"
            class="absolute right-1 top-1 text-gray-400"
            size="square"
            variant="ghost"
            @click="emit('toggleSidebar')"
        >
            <MaterialSymbolsThumbnailBarOutline />
        </Button>

        <ul class="mb-6 flex flex-initial flex-col bg-red-500/0 text-sm">
            <li
                v-for="(item, i) in items"
                :key="i"
                class="rounded font-medium hover:bg-gray-800"
            >
                <RouterLink
                    v-if="item.to"
                    class="block flex items-center px-2 py-1.25 text-gray-300"
                    :to="item.to"
                >
                    <Icon
                        class="mr-1.5"
                        :name="item.icon"
                    />

                    {{ item.text }}
                </RouterLink>

                <div
                    v-else
                    v-tippy="{
                        content: $t('comingSoon'),
                        placement: 'right',
                        offset: [0, 6],
                    }"
                    class="flex cursor-default items-center px-2 py-1.25 text-gray-500"
                >
                    <Icon
                        class="mr-1.5"
                        :name="item.icon"
                    />

                    {{ item.text }}
                </div>
            </li>
        </ul>

        <div class="mb-10 flex flex-grow justify-between pl-2.5 pr-1 text-gray-500">
            <div class="text-xs">
                {{ $t('projects') }}
            </div>

            <MaterialSymbolsAdd
                v-tippy="{
                    content: $t('comingSoon'),
                    placement: 'right-start',
                    offset: [0, 6],
                }"
            />
        </div>

        <button
            class="flex items-center rounded px-2 py-1 font-medium hover:bg-gray-800"
            text="sm gray-300"
            @click="isSettingsOpen = true"
        >
            <MaterialSymbolsSettings class="mr-1.5 opacity-80" />

            {{ $t('settings') }}
        </button>

        <SettingsDialog v-model="isSettingsOpen" />
    </div>
</template>
