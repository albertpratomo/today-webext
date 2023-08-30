<script setup lang="ts">
import IconDelete from '~icons/material-symbols/delete';
import IconEvent from '~icons/material-symbols/event';
import IconInbox from '~icons/material-symbols/inbox';
import {storeToRefs} from 'pinia';
import {useTrashStore} from '~/stores';

const {t} = useI18n();
const {tasks} = storeToRefs(useTrashStore());

const items = computed(() => {
    const items = [
        {
            icon: IconEvent,
            text: t('today'),
            to: {name: 'index'},
            isVisible: true,
        },
        {
            icon: IconDelete,
            text: t('trash'),
            to: {name: 'trash'},
            isVisible: !!tasks.value.length,
        },
        {
            icon: IconEvent,
            text: t('calendar'),
            to: null,
            isVisible: true,
        },
        {
            icon: IconInbox,
            text: t('inbox'),
            to: null,
            isVisible: true,
        },
    ];

    return items.filter(i => i.isVisible);
});
</script>

<template>
    <div class="px-3 py-12">
        <ul class="text-2sm">
            <li
                v-for="(item, i) in items"
                :key="i"
                class="w-50 rounded font-medium hover:bg-gray-800"
            >
                <RouterLink
                    v-if="item.to"
                    class="block flex items-center px-2 py-1.5 text-gray-350"
                    :to="item.to"
                >
                    <Component
                        :is="item.icon"
                        class="mr-2"
                    />

                    {{ item.text }}
                </RouterLink>

                <div
                    v-else
                    class="flex items-center px-2 py-1.5 text-gray-500"
                    :title="$t('comingSoon')"
                >
                    <Component
                        :is="item.icon"
                        class="mr-2"
                    />

                    {{ item.text }}
                </div>
            </li>
        </ul>

        <div
            class="mt-5 flex justify-between px-2 text-gray-200"
            :title="$t('comingSoon')"
        >
            <div class="text-xs">
                {{ $t('projects') }}
            </div>

            <MaterialSymbolsAdd />
        </div>
    </div>
</template>
