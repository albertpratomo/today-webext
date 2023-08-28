<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useTasksStore} from '~/stores/tasks';

const {draftCreateTaskHasContent, taskCreateDialogIsOpen} = storeToRefs(useTasksStore());

const buttonClass = 'px-10 py-2 border border-transparent hover:border-gray-600 rounded';
const iconClass = 'w-6 h-6';
</script>

<template>
    <div class="flex justify-center gap-4 py-2">
        <button
            id="btn-new-task"
            :class="[buttonClass, {'text-indigo-500': draftCreateTaskHasContent}]"
            @click="taskCreateDialogIsOpen = true"
        >
            <MaterialSymbolsAdd :class="iconClass" />
        </button>

        <!-- <button :class="buttonClass">
            <MaterialSymbolsPlayCircleOutline :class="iconClass" />
        </button>

        <button :class="buttonClass">
            <MaterialSymbolsTag :class="iconClass" />
        </button> -->
    </div>
</template>
