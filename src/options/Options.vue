<script setup lang="ts">
import {storageDemo} from '~/logic/storage';
</script>

<template>
    <main class="px-4 py-10 text-center text-gray-700 dark:text-gray-200">
        <img
            alt="extension icon"
            class="icon-btn mx-2 text-2xl"
            src="/assets/icon.svg"
        >

        <div>Options</div>

        <SharedSubtitle />

        <input
            v-model="storageDemo"
            class="mt-2 border border-gray-400 rounded px-2 py-1"
        >

        <div class="mt-4">
            Powered by Vite <PixelarticonsZap class="inline-block align-middle" />
        </div>
    </main>
</template>
