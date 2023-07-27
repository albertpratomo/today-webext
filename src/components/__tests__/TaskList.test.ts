import {fireEvent, render} from '@testing-library/vue';
import TaskList from '~/components/TaskList.vue';
import {vOnClickOutside} from '@vueuse/components';

function prepare() {
    // Pass 5 tasks.
    const modelValue = Array.from({length: 5}, (_, i) => ({title: `task ${i}`}));

    const result = render(TaskList, {
        global: {
            directives: {'on-click-outside': vOnClickOutside},
        },
        props: {
            modelValue,
        },
    });

    return {
        ...result,
        querySelected: () => result.queryByText((_, element) => {
            return element?.getAttribute('aria-selected') === 'true';
        }),
        taskItems: result.getAllByText(/^task/),
    };
}

describe('TaskList', () => {
    test('render tasks', () => {
        const {taskItems} = prepare();

        expect(taskItems.length).toBe(5);
    });

    test('select 1 task', async () => {
        const {taskItems, querySelected} = prepare();

        await fireEvent.click(taskItems[0]);
        let selected = querySelected();
        expect(selected?.textContent).toBe('task 0');

        await fireEvent.click(taskItems[2]);
        selected = querySelected();
        expect(selected?.textContent).toBe('task 2');

        await fireEvent.click(document);
        selected = querySelected();
        expect(selected).toBeNull();
    });

    test.todo('select shift tasks');
});
