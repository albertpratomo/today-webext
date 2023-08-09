<script setup lang="ts">
import {moveArrayElement, useSortable} from '@vueuse/integrations/useSortable';
import type {SortableEvent} from 'sortablejs';
import type Task from '~/models/Task';
import {onKeyStroke} from '~/utils/onKeyStroke';
import {useTasksStore} from '~/stores/tasks';

const {t} = useI18n();
const {editTask} = useTasksStore();
const tasks = defineModel<Task[]>({required: true});
const undoneTasks = computed(() => tasks.value.filter(t => !t.deletedAt && !t.isDone));
const doneTasks = computed(() => tasks.value.filter(t => !t.deletedAt && t.isDone).reverse());
const selectedIndexes = defineModel<number[]>('selectedIndexes', {required: true});

function selectTask(index: number | number[]) {
    if (!Array.isArray(index))
        index = [index];

    selectedIndexes.value = index;
}

function onTaskClick(clicked: number, {ctrlKey, metaKey, shiftKey}: PointerEvent) {
    if (ctrlKey || metaKey) {
        // Select or deselect the task.
        selectedIndexes.value.includes(clicked)
            ? selectedIndexes.value.splice(selectedIndexes.value.indexOf(clicked), 1)
            : selectedIndexes.value.push(clicked);
    }
    else if (shiftKey && selectedIndexes.value.length) {
        const lastIndex = selectedIndexes.value[selectedIndexes.value.length - 1];

        selectTask(Array.from(new Set([
            ...selectedIndexes.value,
            ...Array.from(
                {length: Math.abs(clicked - lastIndex) + 1},
                (_, i) => Math.min(clicked, lastIndex) + i,
            ),
        ])));
    }
    else {
        // Replace the whole selection.
        selectTask(clicked);
    }
}

const onClickOutside = [
    () => selectTask([]),
    // Don't deselect when user click on these elements, so user can insert task
    // under the selected position.
    {ignore: ['#btn-new-task', '#headlessui-portal-root']},
];

onKeyStroke(['ArrowDown', 'ArrowUp'], (e) => {
    e.preventDefault();

    const taskLength = undoneTasks.value.length;
    const isArrowDown = e.key === 'ArrowDown';

    const lastIndex = selectedIndexes.value.at(-1) ?? (isArrowDown ? -1 : 0);
    const selected = (lastIndex + (isArrowDown ? 1 : -1) + taskLength) % taskLength;

    if (e.shiftKey && (e.metaKey || e.ctrlKey) && selectedIndexes.value.length === 1) {
        const oldIndex = selectedIndexes.value[0];
        const newIndex = oldIndex + (isArrowDown ? 1 : -1);
        swapTask(oldIndex, newIndex);
    }
    else if (e.shiftKey) {
        if (selectedIndexes.value.includes(selected))
            selectTask(selectedIndexes.value.filter(i => i !== lastIndex));
        else
            selectedIndexes.value.push(selected);
    }
    else { selectTask(selected); }
});

onKeyStroke(['Esc', 'Escape'], () => {
    selectTask([]);
});

const list = ref<HTMLElement | null>(null);
useSortable(list, tasks, {
    onUpdate: async (e: SortableEvent) => {
        swapTask(e.oldIndex!, e.newIndex!);
    },
});

async function swapTask(oldIndex: number, newIndex: number) {
    if (newIndex >= 0 && newIndex < undoneTasks.value.length) {
        const from = tasks.value.indexOf(undoneTasks.value[oldIndex]);
        const to = tasks.value.indexOf(undoneTasks.value[newIndex]);

        moveArrayElement(tasks.value, from, to);

        await nextTick();

        selectTask(newIndex);
    }
}

const showDoneTasks = ref(false);
const toggleText = computed(() => {
    const key = showDoneTasks.value ? 'hide' : 'show';
    return t(`actions.${key}CompletedTasks`);
});

function onTaskDone(index: number) {
    // Move done task to end of array. So undone tasks are grouped in the
    // beginning of the array and can be reordered correctly.
    tasks.value.push(tasks.value.splice(index, 1)[0]);
}

onKeyStroke(['Backspace'], () => {
    selectedIndexes.value.forEach((i) => {
        undoneTasks.value[i].deletedAt = new Date();
    });

    if (selectedIndexes.value.length > 1)
        selectTask(0);
});
</script>

<template>
    <div>
        <div
            ref="list"
            v-on-click-outside="onClickOutside"
        >
            <TaskItem
                v-for="(task, i) in undoneTasks"
                :key="task.id"
                v-model="undoneTasks[i]"
                :aria-selected="selectedIndexes.includes(i)"
                :is-selected="selectedIndexes.includes(i)"
                @click="onTaskClick(i, $event)"
                @dblclick="editTask(task)"
                @done="onTaskDone(i)"
                @dragstart="selectTask(i)"
            />
        </div>

        <div
            v-if="doneTasks.length"
            class="mt-12"
        >
            <button
                class="rounded p-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-300"
                @click="showDoneTasks = !showDoneTasks"
            >
                {{ toggleText }}
            </button>

            <template v-if="showDoneTasks">
                <TaskItem
                    v-for="(task, i) in doneTasks"
                    :key="task.id"
                    v-model="doneTasks[i]"
                    @dblclick="editTask(task)"
                />
            </template>
        </div>
    </div>
</template>

<style scoped>
:deep([aria-selected="true"]) {
    @apply bg-indigo-900;
}
</style>
