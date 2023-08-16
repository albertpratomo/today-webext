<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {usePomodoroStore} from '~/stores';

const {task} = storeToRefs(usePomodoroStore());
</script>

<template>
    <div>
        hello
        {{ task!.title }}
    </div>
</template>
