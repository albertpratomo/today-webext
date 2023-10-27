<script setup lang="ts">
import {Dialog, DialogPanel} from '@headlessui/vue';

const isOpen = defineModel<boolean>({required: true});

function close() {
    isOpen.value = false;
};
</script>

<template>
    <Dialog
        :open="isOpen"
        @close="close()"
        @keyup.esc="close()"
    >
        <div
            aria-hidden="true"
            class="fixed inset-0 bg-black/30"
        />

        <div class="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel class="relative max-w-3xl w-full border rounded bg-gray-850 px-18 py-10">
                <Button
                    class="absolute right-4 top-4"
                    size="square"
                    variant="ghost"
                    @click="close()"
                >
                    <MaterialSymbolsClose />
                </Button>

                <SettingsCalendars />
            </DialogPanel>
        </div>
    </Dialog>
</template>
