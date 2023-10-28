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
        :class="{'shadow-[0_0_0_1px_#474B66] rounded-sm bg-gray-750 relative z-10': isSelected}"
    >
        <div
            class="flex cursor-pointer select-none items-center border-t px-0.5 py-2 group-last:border-b"
            :class="{'border-transparent': isSelected}"
        >
            <input
                v-model="subtask.isDone"
                class="subtask-checkbox mr-2 cursor-pointer border-2"
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
                class="ml-1 h-4 text-gray-350 opacity-0 group-hover:opacity-100"
                :class="{'opacity-100': isSelected}"
                tabindex="-1"
            >
                <svg
                    fill="none"
                    height="7"
                    viewBox="0 0 10 7"
                    width="10"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g opacity="0.3">
                        <path
                            clip-rule="evenodd"
                            d="M0 0H10V1H0V0ZM0 6H10V7H0V6ZM10 3H0V4H10V3Z"
                            fill="#E0E1EC"
                            fill-rule="evenodd"
                        />
                    </g>
                </svg>
            </button>
        </div>
    </div>
</template>
