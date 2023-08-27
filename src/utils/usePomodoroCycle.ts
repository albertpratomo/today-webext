import breakEndSfx from '~/assets/sounds/breakEnd.mp3';
import focusEndSfx from '~/assets/sounds/focusEnd.mp3';
import tickSfx from '~/assets/sounds/tick.mp3';
import {useCycleList} from '@vueuse/core';
import {useSound} from '@vueuse/sound';
import {useTimer} from './useTimer';

// TODO: Change this to correct numbers.
const MINUTES = 1;
const FOCUS_DURATION = 4 * MINUTES;
const BREAK_DURATION = 2 * MINUTES;
const LONG_BREAK_DURATION = 5 * MINUTES;
const SESSIONS = 3;
const TICK_SOUND_INTERVAL = 2 * MINUTES;

function createCycle() {
    const cycle = [];

    for (let i = 0; i < SESSIONS; i++) {
        cycle.push({
            sessionCount: i,
            duration: FOCUS_DURATION,
            isBreak: false,
        });

        cycle.push({
            sessionCount: i + 1,
            duration: i === SESSIONS - 1 ? LONG_BREAK_DURATION : BREAK_DURATION,
            isBreak: true,
        });
    }

    return cycle;
}

export function usePomodoroCycle() {
    const {state, index, next} = useCycleList(createCycle());

    const timer = useTimer(state.value.duration);

    const {play: playFocusEnd} = useSound(focusEndSfx);
    const {play: playBreakEnd} = useSound(breakEndSfx);
    const {play: playTick} = useSound(tickSfx, {volume: 0.2}); // The tick sfx is louder than the rest.

    function skip() {
        next();

        state.value.isBreak ? playFocusEnd() : playBreakEnd();

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
            && count < FOCUS_DURATION
            && count > 0
            && count % TICK_SOUND_INTERVAL === 0
        )
            playTick();

        if (count <= -1)
            skip();
    });

    return {
        skip,
        state,
        timer,
        resetCycle,
    };
}
