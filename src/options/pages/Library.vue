<script setup lang="ts">

</script>

<template>
    <div class="m-auto w-50 pt-20">
        <div class="flex-initial space-y-5">
            <div class="flex gap-3">
                <Button variant="primary">
                    Primary
                </Button>

                <Button
                    disabled
                    variant="primary"
                >
                    Primary
                </Button>
            </div>

            <div class="flex gap-3">
                <Button
                    size="sm"
                    variant="primary"
                >
                    Primary
                </Button>

                <Button
                    disabled
                    size="sm"
                    variant="primary"
                >
                    Primary
                </Button>
            </div>

            <div class="flex gap-3">
                <Button variant="secondary">
                    Secondary
                </Button>

                <Button
                    disabled
                    variant="secondary"
                >
                    Secondary
                </Button>
            </div>

            <div class="flex gap-3">
                <Button variant="critical">
                    Critical
                </Button>

                <Button
                    disabled
                    variant="critical"
                >
                    Critical
                </Button>
            </div>

            <div class="flex gap-3">
                <Button variant="outline">
                    Outline
                </Button>

                <Button
                    disabled
                    variant="outline"
                >
                    Outline
                </Button>
            </div>

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
