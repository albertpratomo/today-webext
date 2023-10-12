<script setup lang="ts">
import type Subtask from '~/models/Subtask';
import {storeToRefs} from 'pinia';
import {useTasksStore} from '~/stores';

const props = withDefaults(
    defineProps<{
        index: number
        isLastSelected?: boolean
        isSelected?: boolean
    }>(),
    {
        index: 0,
        isLastSelected: false,
        isSelected: false,
    },
);

const emit = defineEmits(['selectSibling', 'subtaskDeleted']);

const {selectedSubtasks, lastSelectedSubtask} = storeToRefs(useTasksStore());

const subtask = defineModel<Subtask>({required: true});

const {createSubtask, deleteSubtask} = useTasksStore();

const create = function () {
    if (subtask.value.title.length > 0)
        createSubtask();
};

const focus = function () {
    if (selectedSubtasks.value.includes(props.index) === false)
        selectedSubtasks.value = [props.index];
};

const remove = function () {
    if (subtask.value.title.length === 0) {
        deleteSubtask(props.index);
        emit('subtaskDeleted');
    }
};
</script>

<template>
    <div
        class="group h-9 flex cursor-pointer select-none items-center border rounded p-2 hover:bg-gray-800"
        :class="[
            {'bg-indigo-900 hover:bg-indigo-900': isSelected},
            isLastSelected ? 'border-indigo-400' : 'border-transparent',
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
            :is-focused="lastSelectedSubtask === index"
            @blur="selectedSubtasks = [];"
            @focus="focus"
            @keyboard-arrow-down="emit('selectSibling', 'below', index)"
            @keyboard-arrow-up="emit('selectSibling', 'above', index)"
            @keydown.backspace="remove"
            @keyup.enter="create"
        />
    </div>
</template>
