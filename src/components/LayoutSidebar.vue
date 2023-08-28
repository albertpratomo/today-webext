<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useTrashStore} from '~/stores';

const {tasks} = storeToRefs(useTrashStore());
</script>

<template>
    <main class="h-screen flex">
        <div class="w-48 shrink-0 border-r p-10 text-lg">
            <ul class="text-2sm space-y-4">
                <li>
                    <RouterLink :to="{name: 'index'}">
                        {{ $t('today') }}
                    </RouterLink>
                </li>

                <li v-if="tasks.length">
                    <RouterLink :to="{name: 'trash'}">
                        {{ $t('trash') }}
                    </RouterLink>
                </li>
            </ul>
        </div>

        <div
            class="flex flex-1 flex-col"
            p="t-10"
        >
            <div class="px-10 space-y-8">
                <slot />
            </div>

            <BottomToolbar class="mt-auto border-t" />
        </div>

        <TaskCreateDialog />

        <TaskEditDialog />

        <TaskFocusDialog />
    </main>
</template>
