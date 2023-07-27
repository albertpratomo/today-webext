<script setup lang="ts">
import 'uno.css';
import {useToggle} from '@vueuse/core';

const [show, toggle] = useToggle(false);
</script>

<template>
    <div class="fixed bottom-0 right-0 z-100 m-5 flex select-none items-end leading-1em font-sans">
        <div
            class="h-min w-max rounded-lg bg-white text-gray-800 shadow"
            :class="show ? 'opacity-100' : 'opacity-0'"
            m="y-auto r-2"
            p="x-4 y-2"
            transition="opacity duration-300"
        >
            <h1 class="text-lg">
                Vitesse WebExt
            </h1>

            <SharedSubtitle />
        </div>

        <button
            bg="teal-600 hover:teal-700"
            class="h-10 w-10 flex cursor-pointer rounded-full border-none shadow"
            @click="toggle()"
        >
            <PixelarticonsPower class="m-auto block text-lg text-white" />
        </button>
    </div>
</template>
