<script setup lang="ts">
import {useDateFormat, useNow} from '@vueuse/core';
import {storeToRefs} from 'pinia';
import {useRoute} from 'vue-router';
import {useTasksStore} from '~/stores/tasks';

const {tasksParent, tasks, doneTasks, selectedTaskIds, taskCreateDialogIsOpen} = storeToRefs(useTasksStore());

const route = useRoute();

const currentParent = computed(() => {
    return (typeof route.name === 'string' && ['inbox', 'today'].includes(route.name) ? route.name : 'today');
});

onMounted(() => {
    tasksParent.value = currentParent.value;
});

watch(currentParent, (newName) => {
    tasksParent.value = newName;
});

const currentDate = useDateFormat(useNow(), 'DD MMM YYYY');

const isCalendarVisible = ref(true);
</script>

<template>
    <LayoutSidebar>
        <div class="relative h-full min-w-0 flex">
            <Button
                class="absolute right-2 top-2 z-1 text-gray-500"
                size="square"
                variant="ghost"
                @click="isCalendarVisible = !isCalendarVisible"
            >
                <MaterialSymbolsCalendarTodayOutline />
            </Button>

            <div class="min-w-0 flex grow justify-center overflow-y-scroll px-8 py-10 md:px-11">
                <div class="max-w-[960px] min-w-0 grow">
                    <div class="h-8 flex justify-between">
                        <h1 class="text-xl font-medium">
                            {{ $t(tasksParent) }}

                            <span
                                v-show="tasksParent === 'today'"
                                class="ml-1 text-gray-500"
                            >
                                {{ currentDate }}
                            </span>
                        </h1>

                        <Button
                            id="btn-new-task"
                            v-tippy="{
                                content: $t('tooltips.newTask'),
                                placement: 'bottom',
                                offset: [0, 6],
                            }"
                            class="text-indigo-400"
                            size="square"
                            variant="ghost"
                            @click="taskCreateDialogIsOpen = true"
                        >
                            <MaterialSymbolsAdd />
                        </Button>
                    </div>

                    <TaskList
                        v-model="tasks"
                        v-model:done-tasks="doneTasks"
                        v-model:selected-task-ids="selectedTaskIds"
                        class="mt-8 pb-10"
                        :tasks-parent="tasksParent"
                    />
                </div>
            </div>

            <Transition name="slide-left-right">
                <div
                    v-show="isCalendarVisible"
                    class="shrink-0 border-l border-gray-750 p-3 pt-4"
                    w="70 xl:80"
                >
                    <CalendarDaily />
                </div>
            </Transition>
        </div>
    </LayoutSidebar>
</template>
