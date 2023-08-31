<script setup lang="ts">
import {useDateFormat, useNow} from '@vueuse/core';
import {storeToRefs} from 'pinia';
import {useTasksStore} from '~/stores/tasks';

const {tasks, doneTasks, selectedIndexes, taskCreateDialogIsOpen} = storeToRefs(useTasksStore());

const currentDate = useDateFormat(useNow(), 'DD MMM YYYY');
</script>

<template>
    <LayoutSidebar>
        <div>
            <div class="h-8 flex justify-between">
                <h1 class="text-xl font-medium">
                    {{ $t('today') }}

                    <span class="ml-1 text-gray-500">
                        {{ currentDate }}
                    </span>
                </h1>

                <button
                    id="btn-new-task"
                    class="rounded p-1.5 text-indigo-400 hover:bg-gray-800"
                    :title="$t('newTaskTooltip')"
                    @click="taskCreateDialogIsOpen = true"
                >
                    <MaterialSymbolsAdd />
                </button>
            </div>

            <TaskList
                v-model="tasks"
                v-model:done-tasks="doneTasks"
                v-model:selected-indexes="selectedIndexes"
                class="mt-8"
            />
        </div>
    </LayoutSidebar>
</template>
