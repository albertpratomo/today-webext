import {fireEvent, render} from '@testing-library/vue';
import ResizeObserver from 'resize-observer-polyfill';
import TaskFocusDialog from '~/components/TaskFocusDialog.vue';
import {createTestingPinia} from '@pinia/testing';
import i18n from '~/i18n';
import {useTasksStore} from '~/stores/tasks';

function prepare(length = 3) {
    globalThis.ResizeObserver = ResizeObserver;

    const result = render(TaskFocusDialog, {
        global: {
            plugins: [createTestingPinia({stubActions: false}), i18n],
        },
    });

    const tasks = Array.from({length}, (_, i) => ({
        id: i + 1,
        title: `task ${i}`,
        note: '',
        isDone: false,
    }));

    const store = useTasksStore();
    store.$patch({tasks});

    return {
        result,
        store,
    };
}

describe('TaskFocusDialog', () => {
    test('[F] to focus on a task', async () => {
        const {result, store} = prepare();

        store.$patch({selectedIndexes: [0]});
        await fireEvent.keyDown(document, {key: 'F'});

        result.getByText('task 0');
    });
});
