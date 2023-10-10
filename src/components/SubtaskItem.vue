<script setup lang="ts">
import type Subtask from '~/models/Subtask';
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

const emit = defineEmits(['moveSelection']);

const subtask = defineModel<Subtask>({required: true});

const {createSubtask, deleteSubtask} = useTasksStore();

const create = function () {
    if (subtask.value.title.length > 0)
        createSubtask();
};

const remove = function () {
    if (subtask.value.title.length === 0) {
        deleteSubtask(props.index);
        emit('moveSelection', 'up', props.index);
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
            @keyboard-arrow-down="emit('moveSelection', 'down', index)"
            @keyboard-arrow-up="emit('moveSelection', 'up', index)"
            @keydown.backspace="remove()"
            @keyup.enter="create()"
        />
    </div>
</template>
