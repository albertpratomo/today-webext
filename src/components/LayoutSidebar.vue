<template>
    <main class="h-screen flex">
        <TheSidebar class="shrink-0 border-r" />

        <div
            class="flex flex-1 flex-col"
            p="t-10"
        >
            <div class="px-10 space-y-8">
                <slot />
            </div>

            <BottomToolbar class="mt-auto border-t" />
        </div>

        <TaskCreateDialog />

        <TaskEditDialog />

        <TaskFocusDialog />
    </main>
</template>
