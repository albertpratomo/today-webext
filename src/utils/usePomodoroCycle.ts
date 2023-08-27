import {useCycleList} from '@vueuse/core';
import {useTimer} from './useTimer';

// TODO: Change this to correct numbers.
const MINUTES = 1;
const SESSION_DURATION = 3 * MINUTES;
const BREAK_DURATION = 2 * MINUTES;
const LONG_BREAK_DURATION = 4 * MINUTES;
const SESSIONS = 3;

function createCycle() {
    const cycle = [];

    for (let i = 0; i < SESSIONS; i++) {
        cycle.push({
            sessionCount: i,
            duration: SESSION_DURATION,
            isBreak: false,
        });

        cycle.push({
            sessionCount: i,
            duration: i === SESSIONS - 1 ? LONG_BREAK_DURATION : BREAK_DURATION,
            isBreak: true,
        });
    }

    return cycle;
}

export function usePomodoroCycle() {
    const {state, next} = useCycleList(createCycle());

    const timer = useTimer(state.value.duration);

    function skip() {
        next();

        const color = state.value.isBreak ? '#1E4E36' : '#12131A';
        browser.action.setBadgeBackgroundColor({color});

        timer.reset((state.value.duration));
    }

    watch(timer.count, (count) => {
        if (count <= -1)
            skip();
    });

    return {
        skip,
        state,
        timer,
    };
}
