import {computedEager, useCounter, useIntervalFn} from '@vueuse/core';

export function useTimer(duration: number) {
    const {count, dec, reset} = useCounter(duration, {
        min: -1,
    });

    const minutes = computed(() => Math.floor(count.value / 60).toString().padStart(2, '0'));
    const seconds = computed(() => (count.value % 60).toString().padStart(2, '0'));

    const {pause, resume, isActive} = useIntervalFn(dec, 1000, {immediate: false});

    const hasRun = computedEager(() => count.value < duration);

    return {
        count,
        minutes,
        seconds,
        isRunning: isActive,
        hasRun,
        play: resume,
        pause,
        reset: (duration?: number) => {
            pause();
            reset(duration);
        },
    };
}

export type UseTimerReturn = ReturnType<typeof useTimer>;
