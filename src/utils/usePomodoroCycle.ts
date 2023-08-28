import {useCycleList, useLocalStorage} from '@vueuse/core';
import {useSound} from '@vueuse/sound';
import {useTimer} from '~/utils/useTimer';

// TODO: Change this to correct numbers.
const MINUTES = 1;
const SESSION_DURATION = 4 * MINUTES;
const BREAK_DURATION = 2 * MINUTES;
const LONG_BREAK_DURATION = 5 * MINUTES;
const SESSIONS = 3;
const TICK_SOUND_INTERVAL = 2 * MINUTES;

function createCycle() {
    const cycle = [];

    for (let i = 0; i < SESSIONS; i++) {
        cycle.push({
            duration: SESSION_DURATION,
            isBreak: false,
        });

        cycle.push({
            duration: i === SESSIONS - 1 ? LONG_BREAK_DURATION : BREAK_DURATION,
            isBreak: true,
        });
    }

    return cycle;
}

export function usePomodoroCycle() {
    const sessionCount = useLocalStorage('pomodoroSessionCount', 0);

    const currentDate = new Date().toDateString();
    const lastPomodoroAt = useLocalStorage('lastPomodoroAt', currentDate);

    if (lastPomodoroAt.value !== currentDate) {
        lastPomodoroAt.value = currentDate;
        sessionCount.value = 0;
    }

    const {state, index, next} = useCycleList(createCycle());

    const timer = useTimer(state.value.duration);

    const {play: playFocusEnd} = useSound('/assets/sounds/focusEnd.mp3');
    const {play: playBreakEnd} = useSound('/assets/sounds/breakEnd.mp3');
    const {play: playTick} = useSound('/assets/sounds/tick.mp3', {volume: 0.2}); // The tick sfx is louder than the rest.

    function skip() {
        if (!state.value.isBreak)
            sessionCount.value++;

        state.value.isBreak ? playBreakEnd() : playFocusEnd();

        next();

        const color = state.value.isBreak ? '#1E4E36' : '#12131A';
        browser.action.setBadgeBackgroundColor({color});

        timer.reset(state.value.duration);
    }

    function resetCycle() {
        index.value = 0;
        timer.reset(state.value.duration);
    }

    watch(timer.count, (count) => {
        if (
            !state.value.isBreak
            && count < SESSION_DURATION
            && count > 0
            && count % TICK_SOUND_INTERVAL === 0
        )
            playTick();

        if (count <= -1)
            skip();
    });

    return {
        resetCycle,
        skip,
        sessionCount,
        state,
        timer,
    };
}
