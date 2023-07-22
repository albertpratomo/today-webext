<script setup lang="ts">
import {tasks} from '~/logic';

function addTask() {
    tasks.value.push({
        title: 'start with a verb',
        isDone: false,
    });
}

const selected = ref<number[]>([]);
</script>

<template>
    <main class="h-screen flex bg-slate-950 text-white">
        <div class="w-48 border-r p-10">
            Today
        </div>

        <div class="flex-1 p-10 space-y-8">
            <button
                class="bg-white px-4 py-2 text-slate-950"
                @click="addTask()"
            >
                Add task
            </button>

            <div v-on-click-outside="() => selected = []">
                <TaskItem
                    v-for="(_, i) in tasks"
                    :key="i"
                    v-model="tasks[i]"
                    :is-selected="selected.includes(i)"
                    @click="selected = [i]"
                />
            </div>

            <!-- TODO: remove this -->
            <pre>{{ tasks }}</pre>

            <!--
            - arrow key navigation
            - enter to start editing -->
        </div>
    </main>
</template>
