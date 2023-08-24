import {createTestingPinia} from '@pinia/testing';
import {setActivePinia} from 'pinia';
import {usePomodoroStore} from '~/stores';

function prepare(length = 3) {
    const tasks = Array.from({length}, (_, i) => ({
        id: i + 1,
        title: `task ${i}`,
        isDone: i % 2 !== 0,
    }));

    setActivePinia(createTestingPinia({
        stubActions: false,
        initialState: {
            tasks: {
                tasks,
            },
        },
    }));

    const store = usePomodoroStore();

    return {
        store,
    };
}

describe('pomodoro', () => {
    test('focusTask', () => {
        const {store} = prepare();
        expect(store.task).toBe(null);

        store.focusTask(3);
        expect(store.task!.id).toBe(3);
    });

    test('focusNextTask', () => {
        const {store} = prepare();
        store.focusTask(1);
        store.focusNextTask();
        expect(store.task!.id).toBe(3);
    });
});
