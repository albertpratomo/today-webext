<script setup lang="ts">
import {type ButtonProps} from './Button.vue';

const buttons = ref<ButtonProps[]>([
    {
        variant: 'primary',
    },
    {
        variant: 'primary',
        size: 'sm',
    },
    {
        variant: 'secondary',
    },
    {
        variant: 'critical',
        size: 'sm',
    },
    {
        variant: 'outline',
    },
    {
        variant: 'outline',
        size: 'sm',
    },
    {
        variant: 'ghost',
    },
    {
        variant: 'ghost',
        size: 'sm',
    },
]);
</script>

<template>
    <ul class="space-y-3">
        <li
            v-for="(button, i) in buttons"
            :key="i"
            class="flex gap-3"
        >
            <Button
                class="capitalize"
                :disabled="false"
                :size="button.size"
                :variant="button.variant"
            >
                {{ button.variant }}
            </Button>

            <Button
                class="capitalize"
                :disabled="true"
                :size="button.size"
                :variant="button.variant"
            >
                {{ button.variant }}
            </Button>
        </li>
    </ul>
</template>
