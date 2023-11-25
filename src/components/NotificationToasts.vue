<template>
    <NotificationGroup
        group="general"
        position="bottom"
    >
        <Notification
            v-slot="{notifications, close}"
            move="transition duration-500"
        >
            <TransitionGroup
                class="fixed inset-x-0 bottom-4 flex flex-col items-center space-y-2"
                name="fade-up"
                tag="div"
            >
                <div
                    v-for="notification in notifications"
                    :key="notification.id"
                    class="z-100 flex items-center gap-4 border border-gray-200/16 rounded-lg bg-gray-850"
                    p="x-3 y-2"
                >
                    <p class="text-[13px] text-gray-100">
                        {{ notification.text }}
                    </p>

                    <button
                        v-if="notification.isCloseable"
                        class="text-gray-400"
                        tabindex="-1"
                        @click="close(notification.id)"
                    >
                        <MaterialSymbolsClose />
                    </button>
                </div>
            </TransitionGroup>
        </Notification>
    </NotificationGroup>
</template>
