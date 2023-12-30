<script setup lang="ts">
import type Task from '~/models/Task';
import {taskBuckets} from '~/utils/buckets';
import {useRoute} from 'vue-router';

const prop = defineProps<{
    task: Task
}>();

const route = useRoute();
const routeName = route.name as string;

const dayLabel = computed(() => {
    const currentBuckets = taskBuckets(prop.task);
    return currentBuckets.find(item => item === 'today' || item === 'tomorrow');
});
</script>

<template>
    <div
        v-if="dayLabel && routeName === 'active'"
        class="mr-[6px] border border-gray-700 rounded-[3px] bg-gray-800 px-[6px] py-1 text-[11px] font-450 leading-3 text-gray-300"
    >
        {{ $t(`sidebar.${dayLabel}`) }}
    </div>
</template>
