import {usePomodoroCycle} from '~/utils/usePomodoroCycle';

describe('usePomodoroCycle', () => {
    it('resets sessionCount to 0 every day', async () => {
        const today = new Date('2023-8-29');
        const tomorrow = new Date('2023-8-30');

        localStorage.pomodoroSessionCount = 3;

        vi.setSystemTime(today);
        const {sessionCount} = usePomodoroCycle();
        expect(sessionCount.value).toBe(3);

        vi.setSystemTime(tomorrow);
        const pomodoro = usePomodoroCycle();
        expect(pomodoro.sessionCount.value).toBe(0);
    });
});
