<script setup lang="ts">
import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogOverlay,
    AlertDialogPortal,
    AlertDialogRoot,
    AlertDialogTitle,
} from 'radix-vue';
import {storeToRefs} from 'pinia';
import {useConfirmDialogStore} from '~/stores/confirmDialog';
import {useFocus} from '@vueuse/core';

const {confirm} = useConfirmDialogStore();
const {confirmDialogIsOpen, confirmDialogProps} = storeToRefs(useConfirmDialogStore());

const confirmButton = ref();
useFocus(confirmButton, {initialValue: true});
</script>

<template>
    <AlertDialogRoot :open="confirmDialogIsOpen">
        <AlertDialogPortal>
            <AlertDialogOverlay class="fixed inset-0 z-30 bg-black/30" />

            <AlertDialogContent
                class="z-30 max-w-xl w-full px-4 inset-center"
                @escape-key-down="confirm(false)"
                @pointer-down-outside="confirm(false)"
            >
                <div class="border rounded bg-gray-800">
                    <div class="p-4">
                        <AlertDialogTitle class="font-medium text-gray-200">
                            {{ confirmDialogProps.title }}
                        </AlertDialogTitle>

                        <AlertDialogDescription class="mt-1.5 text-sm text-gray-300">
                            {{ confirmDialogProps.description }}
                        </AlertDialogDescription>
                    </div>

                    <div class="flex justify-end gap-3 border-t p-3">
                        <AlertDialogCancel as-child>
                            <Button @click="confirm(false)">
                                {{ confirmDialogProps.cancelButtonText }}
                            </Button>
                        </AlertDialogCancel>

                        <AlertDialogAction as-child>
                            <Button
                                ref="confirmButton"
                                :variant="confirmDialogProps.confirmButtonVariant"
                                @click="confirm(true)"
                            >
                                {{ confirmDialogProps.confirmButtonText }}
                            </Button>
                        </AlertDialogAction>
                    </div>
                </div>
            </AlertDialogContent>
        </AlertDialogPortal>
    </AlertDialogRoot>
</template>
