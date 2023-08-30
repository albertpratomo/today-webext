<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useTrashStore} from '~/stores/trash';

const {tasks} = storeToRefs(useTrashStore());
</script>

<template>
    <LayoutSidebar>
        <div>
            <h1 class="h-8 text-xl font-medium">
                {{ $t('trash') }}
            </h1>

            <TaskList
                v-model="tasks"
                class="mt-8"
            />
        </div>
    </LayoutSidebar>
</template>
