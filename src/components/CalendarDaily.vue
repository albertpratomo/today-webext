<script setup lang="ts">
import '~/styles/mobiscroll.scss';
import {MbscEventcalendar, type MbscEventcalendarOptions} from '@mobiscroll/vue';

const options: MbscEventcalendarOptions = {
    dateFormatLong: 'DD MMM', // TODO: seems not working
    showControls: false,
    view: {schedule: {type: 'day', days: false}},
};
</script>

<template>
    <MbscEventcalendar v-bind="options" />
</template>

<style>
.mbsc-schedule-date-header {
    /* @apply hidden; */
}
</style>
