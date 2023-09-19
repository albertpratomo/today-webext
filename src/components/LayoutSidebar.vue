<template>
    <main class="h-screen flex">
        <TheSidebar class="shrink-0 border-r" />

        <div class="flex flex-1 justify-center bg-gray-850">
            <div class="w-180 py-12">
                <slot />
            </div>
        </div>

        <div class="w-72 border-l bg-gray-850 px-3 py-12">
            <TimeGridDay />
        </div>

        <TaskCreateDialog />

        <TaskEditDialog />
    </main>
</template>
