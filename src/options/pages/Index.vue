<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useTasksStore} from '~/stores/tasks';

const {tasks, selectedIndexes} = storeToRefs(useTasksStore());
</script>

<template>
    <LayoutSidebar>
        <div class="space-y-8">
            <h1 class="text-4xl">
                {{ $t('today') }}
            </h1>

            <TaskList
                v-model="tasks"
                v-model:selected-indexes="selectedIndexes"
                class="mt-8"
            />
        </div>
    </LayoutSidebar>
</template>
