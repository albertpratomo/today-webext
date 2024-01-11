<script setup lang="ts">
import type Subtask from '~/models/Subtask';
import {storeToRefs} from 'pinia';
import {useTasksStore} from '~/stores';

withDefaults(
    defineProps<{
        isSelected?: boolean
        isEditable?: boolean
    }>(),
    {
        isSelected: false,
        isEditable: true,
    },
);

const emit = defineEmits(['delete', 'focus']);

const {selectedSubtasks} = storeToRefs(useTasksStore());
const subtask = defineModel<Subtask>({required: true});
const {createSubtask} = useTasksStore();

const create = function () {
    if (subtask.value.title.length > 0)
        createSubtask();
};

const onBackspace = function () {
    if (subtask.value.title.length === 0)
        emit('delete');
};
</script>

<template>
    <div
        class="group px-1.5"
        :class="{'shadow-[0_0_0_1px_#474B66] rounded-sm bg-gray-750 relative': isSelected}"
    >
        <div
            class="flex cursor-pointer select-none border-t px-0.5 py-2 group-last:border-b"
            :class="{'border-transparent': isSelected}"
        >
            <input
                v-model="subtask.isDone"
                class="subtask-checkbox mr-2 mt-1 cursor-pointer border-2"
                type="checkbox"
                @keyup.enter="subtask.isDone = !(subtask.isDone)"
            >

            <SubtaskTitleInput
                v-model="subtask.title"
                :class="{'opacity-50': subtask.isDone}"
                :is-editable="isEditable"
                :is-focused="isSelected"
                @blur="selectedSubtasks = [];"
                @focus="$emit('focus')"
                @keydown.backspace="onBackspace"
                @keyup.enter="create"
            />

            <button
                class="ml-1 mt-0.5 h-4 text-gray-500 opacity-0 group-hover:opacity-100"
                :class="{'opacity-100': isSelected}"
                tabindex="-1"
            >
                <MaterialSymbolsMenu class="h-3.5" />
            </button>
        </div>
    </div>
</template>
