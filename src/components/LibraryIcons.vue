<script setup lang="ts">
const icons = [
    {
        name: 'flower',
    },
    {
        name: 'today',
    },
    {
        name: 'later',
    },
    {
        name: 'trash',
    },
];
</script>

<template>
    <ul class="flex space-x-4">
        <li
            v-for="(icon, i) in icons"
            :key="i"
        >
            <Icon :name="icon.name" />
        </li>
    </ul>
</template>
