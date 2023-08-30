<template>
    <main class="h-screen flex">
        <TheSidebar class="shrink-0 border-r" />

        <div
            class="flex flex-1 flex-col bg-gray-850"
            p="y-12 l-14 r-6"
        >
            <slot />
        </div>

        <div class="w-68 border-l bg-gray-850 pt-10" />

        <TaskCreateDialog />

        <TaskEditDialog />

        <TaskFocusDialog />
    </main>
</template>
