<script setup lang="ts">
import {moveArrayElement, useSortable} from '@vueuse/integrations/useSortable';
import {useHistoryStore, useTasksStore, useTrashStore} from '~/stores';
import type {SortableEvent} from 'sortablejs';
import type Task from '~/models/Task';
import {onKeyStroke} from '~/utils/onKeyStroke';
import {pomodoroIsEnabled} from '~/utils/featureToggle';

const {t} = useI18n();

const tasks = defineModel<Task[]>({required: true});
const doneTasks = defineModel<Task[]>('doneTasks', {local: true, default: []});
const selectedIndexes = defineModel<number[]>('selectedIndexes', {local: true, default: []});

const lastSelectedIndex = computed(() => selectedIndexes.value.at(-1));

onMounted(() => useHistoryStore());

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
    else if (shiftKey && typeof lastSelectedIndex.value === 'number') {
        selectTask(Array.from(new Set([
            ...selectedIndexes.value,
            ...Array.from(
                {length: Math.abs(clicked - lastSelectedIndex.value) + 1},
                (_, i) => Math.min(clicked, lastSelectedIndex.value!) + i,
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

    const taskLength = tasks.value.length;
    const isArrowDown = e.key === 'ArrowDown';

    const lastIndex = lastSelectedIndex.value ?? (isArrowDown ? -1 : 0);
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

const {editTask} = useTasksStore();
onKeyStroke('Enter', ({metaKey}) => {
    if (metaKey && typeof lastSelectedIndex.value === 'number')
        editTask(tasks.value[lastSelectedIndex.value]);
});

const list = ref<HTMLElement | null>(null);
useSortable(list, tasks, {
    onUpdate: async (e: SortableEvent) => {
        swapTask(e.oldIndex!, e.newIndex!);
    },
});

async function swapTask(oldIndex: number, newIndex: number) {
    if (newIndex >= 0 && newIndex < tasks.value.length) {
        moveArrayElement(tasks.value, oldIndex, newIndex);
        await nextTick();
        useHistoryStore().commit();

        selectTask(newIndex);
    }
}

const showDoneTasks = ref(false);
const toggleText = computed(() => {
    const key = showDoneTasks.value ? 'hide' : 'show';
    return t(`actions.${key}CompletedTasks`);
});

const {trashTasks} = useTrashStore();
onKeyStroke(['Backspace'], () => {
    trashTasks(tasks, selectedIndexes.value);

    if (selectedIndexes.value.length > 1)
        selectTask(0);
});
</script>

<template>
    <div>
        <div
            id="undone-task-list"
            ref="list"
            v-on-click-outside="onClickOutside"
            :class="[pomodoroIsEnabled ? '-ml-8' : '-ml-2']"
        >
            <TaskItem
                v-for="(task, i) in tasks"
                :key="task.id"
                v-model="tasks[i]"
                :aria-selected="selectedIndexes.includes(i)"
                class="task-item"
                :is-last-selected="lastSelectedIndex === i "
                :is-selected="selectedIndexes.includes(i)"
                @click="onTaskClick(i, $event)"
                @dblclick="editTask(task)"
                @dragstart="selectTask(i)"
            />
        </div>

        <div
            v-if="doneTasks.length"
            class="mt-12"
        >
            <Button
                class="p-2 text-gray-400 -ml-4"
                variant="ghost"
                @click="showDoneTasks = !showDoneTasks"
            >
                {{ toggleText }}
            </Button>

            <template v-if="showDoneTasks">
                <TaskItem
                    v-for="(task, i) in doneTasks"
                    :key="task.id"
                    v-model="doneTasks[i]"
                    class="-ml-8"
                    @dblclick="editTask(task)"
                />
            </template>
        </div>
    </div>
</template>
