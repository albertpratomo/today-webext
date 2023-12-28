<script setup lang="ts">
const icons = [
    {
        id: 1,
        name: 'flower',
    },
    {
        id: 2,
        name: 'today',
    },
    {
        id: 3,
        name: 'later',
    },
    {
        id: 4,
        name: 'trash',
    },
];
</script>

<template>
    <div class="p-10">
        <LibraryButtons />

        <ul>
            <li
                v-for="(icon, i) in icons"
                :key="i"
            >
                <Icon
                    class="mr-1.5 h-[16px] w-[16px]"
                    :name="icon.name"
                />
            </li>
        </ul>
    </div>
</template>
