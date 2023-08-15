<script setup lang="ts">
function openOptionsPage() {
    browser.runtime.openOptionsPage();
}
</script>

<template>
    <main class="w-[300px] px-4 py-5 text-center text-gray-700">
        <div>Popup</div>

        <SharedSubtitle />

        <button
            class="mt-2 btn"
            @click="openOptionsPage"
        >
            Open Options
        </button>
    </main>
</template>
