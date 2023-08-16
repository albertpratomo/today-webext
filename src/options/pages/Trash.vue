<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useTrashStore} from '~/stores/trash';

const {tasks} = storeToRefs(useTrashStore());
</script>

<template>
    <SidebarLayout>
        <TaskList v-model="tasks" />
    </SidebarLayout>
</template>
