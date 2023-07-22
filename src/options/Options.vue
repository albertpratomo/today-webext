<script setup lang="ts">
import {tasks} from '~/stores/tasks';
</script>

<template>
    <main class="h-screen flex bg-slate-950 text-white">
        <div class="w-48 shrink-0 border-r p-10 text-lg">
            Today
        </div>

        <div
            class="flex flex-1 flex-col"
            p="t-10"
        >
            <div class="overflow-y-scroll px-10 space-y-8">
                <h1 class="text-4xl">
                    Today
                </h1>

                <TaskList
                    v-model="tasks"
                    class="mt-8"
                />

                <!-- TODO: remove this -->
                <!-- <pre class="mt-8">{{ tasks }}</pre> -->
            </div>

            <BottomToolbar class="mt-auto border-t" />
        </div>
    </main>
</template>
