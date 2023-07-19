<script setup lang="ts">
const tasks = [{
    title: 'create today app',
    isDone: false,
}];
</script>

<template>
    <main class="h-screen flex bg-dark text-white">
        <div class="w-48 border-r p-10">
            Today
        </div>

        <div class="flex-1 p-10">
            <TaskItem
                v-for="(_, i) in tasks"
                :key="i"
                v-model="tasks[i]"
            />
        </div>
    </main>
</template>
