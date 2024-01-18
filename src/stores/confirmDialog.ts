import {acceptHMRUpdate, defineStore} from 'pinia';
import type {ButtonProps} from '~/components/Button.vue';
import {i18n} from '~/i18n';
import {useConfirmDialog} from '@vueuse/core';

export const useConfirmDialogStore = defineStore('confirmDialog', () => {
    interface Props {
        title: string
        description: string
        cancelButtonText?: string
        confirmButtonText?: string
        confirmButtonVariant?: ButtonProps['variant']
    }

    const {isRevealed, reveal, confirm} = useConfirmDialog();

    const confirmDialogIsOpen = ref(isRevealed);

    const DEFAULT_PROPS = {
        title: '',
        description: '',
        cancelButtonText: i18n.t('actions.cancel'),
        confirmButtonText: i18n.t('actions.confirm'),
        confirmButtonVariant: 'primary',
    };

    const confirmDialogProps = ref<Props>({
        ...DEFAULT_PROPS,
    });

    async function confirmDialog(props: Props): Promise<boolean> {
        confirmDialogProps.value = {...DEFAULT_PROPS, ...props};

        const {data} = await reveal();
        return data;
    }

    return {
        confirmDialogIsOpen,
        confirmDialogProps,

        confirmDialog,
        confirm,
    };
});

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useConfirmDialogStore, import.meta.hot));
