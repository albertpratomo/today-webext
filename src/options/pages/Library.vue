<script setup lang="ts">
const buttons = ref([
    {
        variant: 'primary',
        label: 'Primary',
    },
    {
        variant: 'primary',
        label: 'Primary',
        size: 'sm',
    },
    {
        variant: 'secondary',
        label: 'Secondary',
    },
    {
        variant: 'critical',
        label: 'Critcal',
        sze: 'sm',
    },
    {
        variant: 'outline',
        label: 'Outline',
    },
    {
        variant: 'outline',
        label: 'Outline',
        size: 'sm',
    },
    {
        variant: 'ghost',
        label: 'Ghost',
    },
    {
        variant: 'ghost',
        label: 'Ghost',
        size: 'sm',
    },
]);
</script>

<template>
    <div class="m-auto w-1/2 p-30">
        <ul class="space-5 flex flex-wrap gap-3">
            <li
                v-for="(button, i) in buttons"
                :key="i"
                class="w-6/12 flex gap-3"
            >
                <Button
                    :disabled="false"
                    :size="button.size"
                    :variant="button.variant"
                >
                    {{ button.label }}
                </Button>

                <Button
                    :disabled="true"
                    :size="button.size"
                    :variant="button.variant"
                >
                    {{ button.label }}
                </Button>
            </li>
        </ul>
    </div>
</template>
