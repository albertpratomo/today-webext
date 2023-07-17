<script setup lang="ts">
import {tasks} from '~/logic';
</script>

<template>
    <main class="h-screen flex bg-dark text-white">
        <div class="w-48 border-r p-10">
            Today
        </div>

        <div class="flex-1 p-10">
            <Tiptap v-model="tasks" />
        </div>
    </main>
</template>
