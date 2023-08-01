import {fireEvent, render} from '@testing-library/vue';
import type {RenderResult} from '@testing-library/vue';
import TaskList from '~/components/TaskList.vue';
import {vOnClickOutside} from '@vueuse/components';

function prepare(length = 5) {
    // Pass 5 tasks.
    const modelValue = Array.from({length}, (_, i) => ({title: `task ${i}`}));

    const result = render(TaskList, {
        global: {
            directives: {'on-click-outside': vOnClickOutside},
        },
        props: {
            modelValue,
            'selectedIndexes': [],
            'onUpdate:selectedIndexes': (selectedIndexes: number[]) => result.rerender({selectedIndexes}),
        },
    });

    return {
        result,
        taskItems: result.getAllByText(/^task/),
    };
}

function expectSelected(result: RenderResult, indexes: number[]) {
    const selected = result.queryAllByText((_, element) => {
        return element?.getAttribute('aria-selected') === 'true';
    });

    expect(selected.length).toBe(indexes.length);

    selected.forEach((taskItem, i) => {
        expect(taskItem.textContent).toBe(`task ${indexes[i]}`);
    });
}

describe('TaskList', () => {
    test('render tasks', () => {
        const {taskItems} = prepare();

        expect(taskItems.length).toBe(5);
    });

    test('click 1 task', async () => {
        const {result, taskItems} = prepare();

        await fireEvent.click(taskItems[0]);
        expectSelected(result, [0]);

        await fireEvent.click(taskItems[2]);
        expectSelected(result, [2]);

        await fireEvent.click(document);
        expectSelected(result, []);
    });

    test('cmd + click tasks', async () => {
        const {result, taskItems} = prepare();

        await fireEvent.click(taskItems[0], {metaKey: true});
        expectSelected(result, [0]);

        await fireEvent.click(taskItems[2], {metaKey: true});
        expectSelected(result, [0, 2]);

        // Deselect task 0.
        await fireEvent.click(taskItems[0], {metaKey: true});
        expectSelected(result, [2]);

        await fireEvent.click(document);
        expectSelected(result, []);
    });

    test('shift + click tasks', async () => {
        const {result, taskItems} = prepare(6);

        await fireEvent.click(taskItems[1], {shiftKey: true});
        expectSelected(result, [1]);

        await fireEvent.click(taskItems[3], {shiftKey: true});
        expectSelected(result, [1, 2, 3]);

        await fireEvent.click(taskItems[5], {shiftKey: true});
        expectSelected(result, [1, 2, 3, 4, 5]);

        await fireEvent.click(taskItems[0], {shiftKey: true});
        expectSelected(result, [0, 1, 2, 3, 4, 5]);

        // Deselect task 2.
        await fireEvent.click(taskItems[2], {metaKey: true});
        expectSelected(result, [0, 1, 3, 4, 5]);
    });

    test('select task with arrow keys', async () => {
        const {result} = prepare();

        await fireEvent.keyDown(document, {key: 'ArrowUp'});
        expectSelected(result, [4]);

        await fireEvent.keyDown(document, {key: 'ArrowUp'});
        expectSelected(result, [3]);

        await fireEvent.keyDown(document, {key: 'ArrowUp'});
        expectSelected(result, [2]);

        await fireEvent.click(document); // Clicks away.

        await fireEvent.keyDown(document, {key: 'ArrowDown'});
        expectSelected(result, [0]);

        await fireEvent.keyDown(document, {key: 'ArrowUp'});
        expectSelected(result, [4]);

        await fireEvent.keyDown(document, {key: 'ArrowDown'});
        expectSelected(result, [0]);

        await fireEvent.keyDown(document, {key: 'ArrowDown'});
        expectSelected(result, [1]);

        await fireEvent.keyDown(document, {key: 'Esc'});
        expectSelected(result, []);
    });

    test('shift select tasks with arrow keys', async () => {
        const {result} = prepare();

        await fireEvent.keyDown(document, {key: 'ArrowDown'});
        expectSelected(result, [0]);

        await fireEvent.keyDown(document, {key: 'ArrowUp', shiftKey: true});
        expectSelected(result, [0, 4]);

        await fireEvent.keyDown(document, {key: 'ArrowUp', shiftKey: true});
        expectSelected(result, [0, 3, 4]);

        await fireEvent.keyDown(document, {key: 'ArrowDown', shiftKey: true});
        expectSelected(result, [0, 4]);

        await fireEvent.keyDown(document, {key: 'ArrowDown', shiftKey: true});
        expectSelected(result, [0]);
    });
});
