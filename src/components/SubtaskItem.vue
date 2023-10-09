<script setup lang="ts">
import type Subtask from '~/models/Subtask';
import {useTasksStore} from '~/stores';

const {index, isLastSelectedSubtask = false, isSelectedSubtask = false} = defineProps<{
    index: number
    isLastSelectedSubtask?: boolean
    isSelectedSubtask?: boolean
}>();

const subtask = defineModel<Subtask>({required: true});

const {createSubtask} = useTasksStore();

const create = function () {
    if (subtask.value.title.length > 0)
        createSubtask();
};
</script>

<template>
    <div
        class="group h-9 flex cursor-pointer select-none items-center border rounded p-2 hover:bg-gray-800"
        :class="[
            {'bg-indigo-900 hover:bg-indigo-900': isSelectedSubtask},
            isLastSelectedSubtask ? 'border-indigo-400' : 'border-transparent',
        ]"
    >
        <input
            v-model="subtask.isDone"
            class="mr-2 cursor-pointer border-2"
            type="checkbox"
        >

        <SubtaskTitleInput
            v-model="subtask.title"
            :index="index"
            @keyup.enter="create()"
        />
    </div>
</template>
