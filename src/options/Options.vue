<script setup lang="ts">
import {pomodoroIsEnabled} from '~/utils/featureToggle';
</script>

<template>
    <RouterView />

    <PomodoroWindow v-if="pomodoroIsEnabled" />

    <NotificationToasts />
</template>
