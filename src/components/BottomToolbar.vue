<script setup lang="ts">
const buttonClass = 'px-10 py-2 border border-transparent hover:border-gray-600 rounded';
const iconClass = 'w-6 h-6';
</script>

<template>
    <div class="flex justify-center gap-4 py-2">
        <button :class="buttonClass">
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
