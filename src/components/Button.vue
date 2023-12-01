<script setup lang="ts">
import {type VariantProps, cva} from 'class-variance-authority';
import {twMerge} from 'tailwind-merge';

withDefaults(
    defineProps<{
        variant?: ButtonProps['variant']
        size?: ButtonProps['size']
    }>(),
    {
        variant: 'secondary',
        size: 'md',
    },
);

const button = cva([
    'flex',
    'gap-2',
    'items-center',
    'justify-center',
    'rounded',
    'font-[300]',
    'focus-visible:ring',
    'focus:outline-none',
    'enabled:active:text-opacity-70',
    'focus:ring-indigo-200',
    'disabled:opacity-50',
], {
    variants: {
        variant: {
            primary: [
                'bg-indigo-600',
                'enabled:hover:bg-indigo-700',
                'enabled:active:bg-indigo-800',
                'shadow-button',
                'enabled:active:shadow-button-clicked',
                'text-gray-300',
            ],
            secondary: [
                'bg-gray-600',
                'enabled:hover:bg-gray-750',
                'enabled:active:bg-gray-800',
                'shadow-button',
                'enabled:active:shadow-button-clicked',
                'text-gray-300',
            ],
            critical: [
                'bg-critical-default',
                'enabled:hover:bg-critical-hover',
                'enabled:active:bg-critical-pressed',
                'shadow-button',
                'enabled:active:shadow-button-clicked',
                'text-gray-300',
            ],
            outline: [
                'border',
                'enabled:hover:text-gray-300',
                'enabled:hover:bg-gray-800/30',
                'border-gray-750',
                'text-gray-300/70',
            ],
            ghost: [
                'bg-transparent',
                'enabled:hover:bg-gray-800',
                'shadow-none',
                'enabled:active:shadow-none',
            ],
        },
        size: {
            sm: 'px-3 py-1.5 text-2sm',
            md: 'px-4 py-1.5 text-sm leading-5',
            square: 'p-1.5',
        },
    },
});

type ButtonProps = VariantProps<typeof button>;
</script>

<template>
    <button :class="twMerge(button({variant, size}))">
        <slot />
    </button>
</template>
