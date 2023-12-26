import {fireEvent, render} from '@testing-library/vue';
import type {RenderResult} from '@testing-library/vue';
import TaskList from '~/components/TaskList.vue';
import {createTestingPinia} from '@pinia/testing';
import i18n from '~/i18n';
import {useTasksStore} from '~/stores/tasks';
import {useTrashStore} from '~/stores/trash';
import {vOnClickOutside} from '@vueuse/components';

function prepare(length = 5) {
    const tasks = Array.from({length}, (_, i) => ({
        id: i + 1,
        title: `task ${i}`,
        isDone: false,
    }));

    const pinia = createTestingPinia({
        initialState: {
            tasks: {tasks},
        },
    });

    const tasksStore = useTasksStore();
    const trashStore = useTrashStore();

    const result = render(TaskList, {
        global: {
            directives: {'on-click-outside': vOnClickOutside},
            plugins: [pinia, i18n],
        },
        props: {
            modelValue: tasksStore.tasks,
            doneTasks: tasksStore.doneTasks,
        },
    });

    return {
        result,
        tasksStore,
        trashStore,
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

        await fireEvent.keyDown(document, {key: 'ArrowDown'});
        expectSelected(result, [1]);

        await fireEvent.keyDown(document, {key: 'ArrowUp', shiftKey: true});
        expectSelected(result, [0, 1]);

        await fireEvent.keyDown(document, {key: 'ArrowUp', shiftKey: true});
        expectSelected(result, [0, 1]);

        await fireEvent.keyDown(document, {key: 'ArrowDown', shiftKey: true});
        expectSelected(result, [1]);

        await fireEvent.keyDown(document, {key: 'ArrowDown', shiftKey: true});
        expectSelected(result, [1, 2]);

        await fireEvent.keyDown(document, {key: 'ArrowDown', shiftKey: true});
        expectSelected(result, [1, 2, 3]);

        await fireEvent.keyDown(document, {key: 'ArrowDown'});
        expectSelected(result, [4]);
    });

    test('edit 1 task', async () => {
        const {tasksStore, taskItems} = prepare(1);

        await fireEvent.dblClick(taskItems[0]);
        expect(tasksStore.editTask).toHaveBeenCalledWith({
            id: 1,
            title: 'task 0',
            isDone: false,
        });
    });

    test.todo('cmd + shift + arrow key to reorder task', async () => {
        const {result} = prepare(2);

        await fireEvent.keyDown(document, {key: 'ArrowDown'});
        expectSelected(result, [0]);

        await fireEvent.keyDown(document, {key: 'ArrowDown', metaKey: true, shiftKey: true});
        await nextTick();
        let taskItems = await result.findAllByText(/^task/);
        expect(taskItems[1].textContent).toBe('task 0');

        await fireEvent.keyDown(document, {key: 'ArrowUp', metaKey: true, shiftKey: true});
        await nextTick();
        taskItems = await result.findAllByText(/^task/);
        expect(taskItems[0].textContent).toBe('task 0');
    });

    test('click checkbox to complete task', async () => {
        vi.useFakeTimers();
        const {result} = prepare(1);

        const input: HTMLInputElement = result.getByRole('checkbox');
        await fireEvent.update(input);

        expect(input.checked).toBe(true);
    });

    test('[D] to complete task', async () => {
        const {result} = prepare(1);

        await fireEvent.keyDown(document, {key: 'ArrowDown'});
        expectSelected(result, [0]);

        await fireEvent.keyDown(document, {key: 'd'});
        const input: HTMLInputElement = result.getByRole('checkbox');
        expect(input.checked).toBe(true);

        await fireEvent.keyDown(document, {key: 'd'});
        expect(input.checked).toBe(false);
    });

    test('backspace to delete task', async () => {
        const {taskItems, trashStore} = prepare();

        await fireEvent.click(taskItems[1], {metaKey: true});
        await fireEvent.click(taskItems[2], {metaKey: true});
        await fireEvent.keyDown(document, {key: 'Backspace'});

        expect(trashStore.removeTasks).toHaveBeenCalledWith([2, 3]);
    });
});
