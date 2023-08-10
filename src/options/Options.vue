<script setup lang="ts">
import {onKeyStroke} from '~/utils/onKeyStroke';
import {storeToRefs} from 'pinia';
import {useTasksStore} from '~/stores/tasks';
import {useThrottledRefHistory} from '@vueuse/core';
import {useTrashStore} from '~/stores/trash';

const {tasks} = storeToRefs(useTasksStore());
const {tasks: trashTasks} = storeToRefs(useTrashStore());

const historiable = computed({
    get: () => ({tasks, trashTasks}),
    set: (val) => {
        // @ts-expect-error: the ref is unwrapped so we must use the private `_value`.
        tasks.value = val.tasks._value;
        // @ts-expect-error: the ref is unwrapped so we must use the private `_value`.
        trashTasks.value = val.trashTasks._value;
    },
});

const {undo, redo} = useThrottledRefHistory(historiable, {
    capacity: 10,
    deep: true,
    throttle: 1000,
});

onKeyStroke(['z', 'Z'], ({metaKey, ctrlKey, shiftKey}) => {
    if ((metaKey || ctrlKey))
        shiftKey ? redo() : undo();
});
</script>

<template>
    <main class="h-screen flex">
        <div class="w-48 shrink-0 border-r p-10 text-lg">
            <ul class="space-y-4">
                <li>
                    <RouterLink :to="{name: 'index'}">
                        {{ $t('today') }}
                    </RouterLink>
                </li>

                <li>
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
                <RouterView />
            </div>

            <BottomToolbar class="mt-auto border-t" />
        </div>

        <TaskCreateDialog />

        <TaskEditDialog />
    </main>
</template>
