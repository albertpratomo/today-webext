<template>
    <main class="h-screen flex">
        <div class="w-48 shrink-0 border-r p-10 text-lg">
            <ul class="space-y-4">
                <li>
                    <RouterLink :to="{name: 'index'}">
                        {{ $t('today') }}
                    </RouterLink>
                </li>

                <!-- TODO: Remove this -->
                <li>
                    <RouterLink :to="{name: 'pomodoro'}">
                        Pomodoro
                    </RouterLink>
                </li>

                <li>
                    <RouterLink :to="{name: 'trash'}">
                        {{ $t('trash') }}
                    </RouterLink>
                </li>
            </ul>
        </div>

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
