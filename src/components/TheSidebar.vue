<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useTrashStore} from '~/stores';

const {t} = useI18n();
const {tasks} = storeToRefs(useTrashStore());

const items = computed(() => {
    const items = [
        {
            icon: 'calendar',
            text: t('today'),
            to: {name: 'index'},
            isVisible: true,
        },
        {
            icon: 'trash',
            text: t('trash'),
            to: {name: 'trash'},
            isVisible: !!tasks.value.length,
        },
        {
            icon: 'trash',
            text: t('calendar'),
            to: null,
            isVisible: true,
        },
        {
            icon: 'trash',
            text: t('inbox'),
            to: null,
            isVisible: true,
        },
    ];

    return items.filter(i => i.isVisible);
});
</script>

<template>
    <div class="px-3 py-10">
        <ul class="text-2sm">
            <li
                v-for="(item, i) in items"
                :key="i"
                class="w-50 rounded font-medium text-gray-400 hover:bg-gray-800"
            >
                <RouterLink
                    v-if="item.to"
                    class="block px-2 py-1.5"
                    :to="item.to"
                >
                    {{ item.text }}
                </RouterLink>

                <div
                    v-else
                    class="px-2 py-1.5"
                >
                    {{ item.text }}
                </div>
            </li>
        </ul>
    </div>
</template>
