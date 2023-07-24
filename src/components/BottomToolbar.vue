<script setup lang="ts">
import {useTasksStore} from '~/stores/tasks';

const {newTask} = useTasksStore();

const buttonClass = 'px-10 py-2 border border-transparent hover:border-slate-8 rounded';
const iconClass = 'w-6 h-6';
</script>

<template>
    <div class="flex justify-center gap-4 py-2">
        <button
            :class="buttonClass"
            @click="newTask()"
        >
            <MaterialSymbolsAdd :class="iconClass" />
        </button>

        <button :class="buttonClass">
            <MaterialSymbolsPlayCircleOutline :class="iconClass" />
        </button>

        <button :class="buttonClass">
            <MaterialSymbolsTag :class="iconClass" />
        </button>
    </div>
</template>
