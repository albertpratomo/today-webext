<script setup lang="ts">
import {newTask} from '~/stores/tasks';

const buttonClass = 'px-10 py-2 border border-transparent hover:border-slate-8 rounded';

const iconClass = 'w-6 h-6';
</script>

<template>
    <div class="flex justify-center gap-4 py-2">
        <button
            :class="buttonClass"
            @click="newTask()"
        >
            <HeroiconsPlus :class="iconClass" />
        </button>

        <button :class="buttonClass">
            <HeroiconsPlay :class="iconClass" />
        </button>

        <button :class="buttonClass">
            <HeroiconsHashtag :class="iconClass" />
        </button>
    </div>
</template>
