import {useCounter, useIntervalFn} from '@vueuse/core';

export function useTimer(duration: number) {
    const {count, dec, reset} = useCounter(duration, {
        max: duration,
        min: 0,
    });

    const minutes = computed(() => Math.floor(count.value / 60).toString().padStart(2, '0'));
    const seconds = computed(() => (count.value % 60).toString().padStart(2, '0'));

    const {pause, resume, isActive} = useIntervalFn(dec, 1000, {immediate: false});

    return {
        minutes,
        seconds,
        isRunning: isActive,
        play: resume,
        pause,
        reset,
    };
}
