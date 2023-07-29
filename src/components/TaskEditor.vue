<script setup lang="ts">
import type Task from '~/models/Task';

const task = defineModel<Task>({required: true});
</script>

<template>
    <div class="border rounded bg-gray-800 text-gray-100">
        <div class="py-4 pl-5 pr-2">
            <div class="flex justify-between">
                <TaskTitleInput v-model="task.title" />

                <button>
                    <MaterialSymbolsPlayCircleOutline class="h-6 w-6" />
                </button>
            </div>

            <TaskNoteInput
                v-model="task.note"
                class="mt-4"
            />

            <div class="flex justify-end gap-2">
                <button class="btn-icon">
                    <MaterialSymbolsStarRounded />
                </button>

                <button class="btn-icon">
                    <MaterialSymbolsScheduleOutline />
                </button>
            </div>
        </div>

        <div class="flex justify-end gap-2 border-t p-2 pl-5">
            <button class="btn-gray">
                {{ $t('actions.cancel') }}
            </button>

            <button class="btn-indigo">
                {{ $t('actions.addTask') }}
            </button>
        </div>
    </div>
</template>
