<script setup lang="ts">
import {useDateFormat, useNow} from '@vueuse/core';
import {storeToRefs} from 'pinia';
import {useTasksStore} from '~/stores/tasks';

const {tasks, doneTasks, selectedIndexes} = storeToRefs(useTasksStore());

const currentDate = useDateFormat(useNow(), 'DD MMM YYYY');
</script>

<template>
    <LayoutSidebar>
        <div class="space-y-8">
            <h1 class="pl-3 text-xl font-medium">
                {{ $t('today') }}

                <span class="ml-1 text-gray-500">
                    {{ currentDate }}
                </span>
            </h1>

            <TaskList
                v-model="tasks"
                v-model:done-tasks="doneTasks"
                v-model:selected-indexes="selectedIndexes"
                class="mt-8"
            />
        </div>
    </LayoutSidebar>
</template>
