<script setup lang="ts">
const tasks = ref([{
    title: 'create today app',
    isDone: false,
}]);

function addTask() {
    tasks.value.push({
        title: 'start with a verb',
        isDone: false,
    });
}
</script>

<template>
    <main class="h-screen flex bg-slate-950 text-white">
        <div class="w-48 border-r p-10">
            Today
        </div>

        <div class="flex-1 p-10 space-y-4">
            <button
                class="bg-white px-4 py-2 text-slate-950"
                @click="addTask()"
            >
                Add task
            </button>

            <TaskItem
                v-for="(_, i) in tasks"
                :key="i"
                v-model="tasks[i]"
            />
        </div>
    </main>
</template>
