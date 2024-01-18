<script setup lang="ts">
import {pomodoroIsEnabled} from '~/utils/featureToggle';
</script>

<template>
    <RouterView />

    <PomodoroWindow v-if="pomodoroIsEnabled" />
    <ConfirmDialog />
    <NotificationToasts />
</template>
