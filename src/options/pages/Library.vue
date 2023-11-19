<script setup lang="ts">

</script>

<template>
    <div class="m-auto w-50 pt-20">
        <div class="flex-initial space-y-5">
            <Button variant="primary">
                Primary
            </Button>

            <Button
                disabled
                variant="primary"
            >
                Primary
            </Button>

            <Button variant="secondary">
                Secondary
            </Button>

            <Button
                disabled
                variant="secondary"
            >
                Secondary
            </Button>

            <Button variant="outline">
                Outline
            </Button>

            <Button
                disabled
                variant="outline"
            >
                Outline
            </Button>

            <Button
                id="btn-new-task"
                size="square"
            >
                <MaterialSymbolsAdd />
            </Button>

            <Button
                class="p-2 text-gray-400"
                variant="ghost"
            >
                Show completed
            </Button>
        </div>
    </div>
</template>
