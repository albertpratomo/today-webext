<template>
    <main class="h-screen flex overflow-x-hidden">
        <TheSidebar class="shrink-0 border-r" />

        <div class="grow bg-gray-850">
            <slot />
        </div>

        <TaskCreateDialog />

        <TaskEditDialog />
    </main>
</template>
