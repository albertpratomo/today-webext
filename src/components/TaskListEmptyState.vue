<script setup lang="ts">
withDefaults(
    defineProps<{
        bucket: string
        isCloseable?: boolean
    }>(),
    {
        isCloseable: false,
    },
);

const isVisible = defineModel<boolean>('isVisible', {local: true, default: true});

function close() {
    isVisible.value = false;
}
</script>

<template>
    <div
        v-show="isVisible"
        class="relative mx-auto mb-10 mt-8 max-w-md border border-gray-750 rounded-2 bg-gray-800 p-6"
    >
        <Button
            v-show="isCloseable"
            class="absolute right-4 top-4"
            size="square"
            variant="ghost"
            @click="close()"
        >
            <MaterialSymbolsClose />
        </Button>

        <div class="flex items-center gap-2 pb-[10px]">
            <Icon
                class="h-[20px] w-[20px]"
                :name="bucket"
            />

            <h2 class="text-[20px] font-semibold">
                {{ $t(`sidebar.${bucket}`) }}
            </h2>
        </div>

        <p
            class="text-[14px] text-gray-400"
            v-html="$t(`emptyState.${bucket}`)"
        />
    </div>
</template>
