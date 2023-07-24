import {render} from '@testing-library/vue';
import {vOnClickOutside} from '@vueuse/components';
import TaskList from '~/components/TaskList.vue';

describe('TaskList', () => {
    it('renders tasks', () => {
        const {getAllByText} = render(TaskList, {
            global: {
                directives: {'on-click-outside': vOnClickOutside},
            },
            props: {
                modelValue: [{title: 'task 1'}, {title: 'task 2'}],
            },
        });

        expect(getAllByText(/^task/).length).toBe(2);
    });
});
