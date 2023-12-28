<script setup lang="ts">
import {AlertDialog} from 'radix-vue/namespaced';
import {i18n} from '~/i18n';
import {useConfirmDialog} from '@vueuse/core';

interface Props {
    title: string
    description: string
    cancelButtonText?: string
    confirmButtonText?: string
}

const {
    cancelButtonText = i18n.t('actions.cancel'),
    confirmButtonText = i18n.t('actions.confirm'),
} = defineProps<Props>();

const {isRevealed, reveal, confirm: _confirm} = useConfirmDialog();

async function confirm(): Promise<boolean> {
    const {data} = await reveal();

    return data;
}

defineExpose({confirm});
</script>

<template>
    <AlertDialog.Root v-model:open="isRevealed">
        <AlertDialog.Portal>
            <AlertDialog.Overlay class="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 z-30" />

            <AlertDialog.Content class="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] z-[100] max-h-[85vh] max-w-[500px] w-[90vw] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-gray-800 p-[25px] text-[15px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                <AlertDialog.Title class="text-mauve12 m-0 text-[17px] font-semibold">
                    {{ title }}
                </AlertDialog.Title>

                <AlertDialog.Description class="text-mauve11 mb-5 mt-4 text-[15px] leading-normal">
                    {{ description }}
                </AlertDialog.Description>

                <div class="flex justify-end gap-[25px]">
                    <AlertDialog.Cancel class="text-mauve11 bg-mauve4 focus:shadow-mauve7 hover:bg-mauve5 h-[35px] inline-flex items-center justify-center rounded-[4px] px-[15px] font-semibold leading-none outline-none focus:shadow-[0_0_0_2px]"
                    @click="_confirm(false)"
                    >
                        {{ cancelButtonText }}
                    </AlertDialog.Cancel>

                    <AlertDialog.Action
                        class="text-red11 h-[35px] inline-flex items-center justify-center rounded-[4px] bg-red4 px-[15px] font-semibold leading-none outline-none hover:bg-red5 focus:shadow-[0_0_0_2px] focus:shadow-red7"
                        @click="_confirm(true)"
                    >
                        {{ confirmButtonText }}
                    </AlertDialog.Action>
                </div>
            </AlertDialog.Content>
        </AlertDialog.Portal>
    </AlertDialog.Root>
</template>
