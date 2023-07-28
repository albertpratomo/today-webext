<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useTasksStore} from '~/stores/tasks';

const {tasks} = storeToRefs(useTasksStore());
</script>

<template>
    <main class="h-screen flex bg-gray-900 text-white">
        <div class="w-48 shrink-0 border-r p-10 text-lg">
            Today
        </div>

        <div
            class="flex flex-1 flex-col"
            p="t-10"
        >
            <div class="px-10 space-y-8">
                <h1 class="text-4xl">
                    Today
                </h1>

                <TaskList
                    v-model="tasks"
                    class="mt-8"
                />
            </div>

            <BottomToolbar class="mt-auto border-t" />
        </div>

        <TaskEditorDialog />
    </main>
</template>
