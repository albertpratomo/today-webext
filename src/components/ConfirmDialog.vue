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
import type {ButtonProps} from './Button.vue';
import {i18n} from '~/i18n';
import {useConfirmDialog} from '@vueuse/core';

export interface Props {
    title: string
    description: string
    cancelButtonText?: string
    confirmButtonText?: string
    confirmButtonVariant?: ButtonProps['variant']
}

const {
    cancelButtonText = i18n.t('actions.cancel'),
    confirmButtonText = i18n.t('actions.confirm'),
    confirmButtonVariant = 'primary',
} = defineProps<Props>();

const {isRevealed, reveal, confirm: _confirm} = useConfirmDialog();

async function confirm(): Promise<boolean> {
    const {data} = await reveal();

    return data;
}

defineExpose({confirm});
</script>

<template>
    <AlertDialogRoot v-model:open="isRevealed">
        <AlertDialogPortal>
            <AlertDialogOverlay class="fixed inset-0 z-30 bg-black/30" />

            <AlertDialogContent
                class="z-30 max-w-xl w-full px-4 inset-center"
                @escape-key-down="_confirm(false)"
                @pointer-down-outside="_confirm(false)"
            >
                <div class="border rounded bg-gray-800">
                    <div class="p-4">
                        <AlertDialogTitle class="font-medium text-gray-200">
                            {{ title }}
                        </AlertDialogTitle>

                        <AlertDialogDescription class="mt-1.5 text-sm text-gray-300">
                            {{ description }}
                        </AlertDialogDescription>
                    </div>

                    <div class="flex justify-end gap-3 border-t p-3">
                        <AlertDialogCancel>
                            <Button @click="_confirm(false)">
                                {{ cancelButtonText }}
                            </Button>
                        </AlertDialogCancel>

                        <AlertDialogAction>
                            <Button
                                :variant="confirmButtonVariant"
                                @click="_confirm(true)"
                            >
                                {{ confirmButtonText }}
                            </Button>
                        </AlertDialogAction>
                    </div>
                </div>
            </AlertDialogContent>
        </AlertDialogPortal>
    </AlertDialogRoot>
</template>
