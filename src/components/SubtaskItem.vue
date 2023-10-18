<script setup lang="ts">
import type Subtask from '~/models/Subtask';
import {storeToRefs} from 'pinia';
import {useTasksStore} from '~/stores';

const props = withDefaults(
    defineProps<{
        index: number
        isSelected?: boolean
        isSorting?: boolean
    }>(),
    {
        index: 0,
        isSelected: false,
        isSorting: false,
    },
);

const emit = defineEmits(['subtaskDeleted']);

const {selectedSubtasks} = storeToRefs(useTasksStore());
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

const onBackspace = function () {
    if (subtask.value.title.length === 0) {
        deleteSubtask(props.index);
        emit('subtaskDeleted');
    }
};
</script>

<template>
    <div
        class="group h-9 flex cursor-pointer select-none items-center border rounded p-2 hover:bg-gray-800"
        :class="{'bg-indigo-900 border-indigo-400 hover:bg-indigo-900': isSelected}"
    >
        <input
            v-model="subtask.isDone"
            class="mr-2 cursor-pointer border-2"
            type="checkbox"
        >

        <SubtaskTitleInput
            v-model="subtask.title"
            :is-editable="isSorting === false"
            :is-focused="isSelected"
            @blur="selectedSubtasks = [];"
            @focus="focus"
            @keydown.backspace="onBackspace"
            @keyup.enter="create"
        />

        <button :class="{hidden: isSelected}">
            ≡
        </button>
    </div>
</template>
