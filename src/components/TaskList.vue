<script setup lang="ts">
import {moveArrayElement, useSortable} from '@vueuse/integrations/useSortable';
import {useHistoryStore, useTasksStore, useTrashStore} from '~/stores';
import type {SortableEvent} from 'sortablejs';
import type Task from '~/models/Task';
import {onKeyStroke} from '~/utils/onKeyStroke';
import {pomodoroIsEnabled} from '~/utils/featureToggle';

const props = withDefaults(
    defineProps<{
        tasksParent?: string | null
    }>(),
    {
        tasksParent: null,
    },
);

const {t} = useI18n();

const tasks = defineModel<Task[]>({required: true});
const doneTasks = defineModel<Task[]>('doneTasks', {local: true, default: []});
const selectedTaskIds = defineModel<number[]>('selectedTaskIds', {local: true, default: []});

const lastSelectedTaskId = computed(() => selectedTaskIds.value.at(-1));

const selectedTaskIndexes = computed(() => {
    return selectedTaskIds.value.map(taskId =>
        tasks.value.findIndex(task => task.id === taskId),
    );
});

const parentTasks = computed(() => {
    return tasks.value.filter(task => task.parent === props.tasksParent || (typeof task.parent === 'undefined' && props.tasksParent === 'today'));
});

const parentDoneTasks = computed(() => {
    return doneTasks.value.filter(task => task.parent === props.tasksParent);
});

onMounted(() => useHistoryStore());

function selectTask(id: number | number[]) {
    if (!Array.isArray(id))
        id = [id];

    selectedTaskIds.value = id;
}

function onTaskClick(clicked: number, {ctrlKey, metaKey, shiftKey}: PointerEvent) {
    if (ctrlKey || metaKey) {
        // Select or deselect the task.
        selectedTaskIds.value.includes(clicked)
            ? selectedTaskIds.value.splice(selectedTaskIds.value.indexOf(clicked), 1)
            : selectedTaskIds.value.push(clicked);
    }
    else if (shiftKey && typeof lastSelectedTaskId.value === 'number') {
        const clickedIndex = parentTasks.value.findIndex(task => task.id === clicked);
        const lastIndex = lastSelectedTaskId.value !== null
            ? parentTasks.value.findIndex(task => task.id === lastSelectedTaskId.value)
            : clickedIndex; // Fallback to clickedIndex if lastSelectedTaskId is null

        const minIndex = Math.min(clickedIndex, lastIndex);
        const maxIndex = Math.max(clickedIndex, lastIndex);

        const rangeTaskIds = parentTasks.value.slice(minIndex, maxIndex + 1).map(task => task.id);

        // Combine existing selectedTaskIds with new range
        selectedTaskIds.value = Array.from(new Set([...selectedTaskIds.value, ...rangeTaskIds]));
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
    // If a dialog is open, ignore the arrow pressed event.
    if (document.querySelector('[role=dialog][data-headlessui-state=open]'))
        return;

    e.preventDefault();

    const taskLength = parentTasks.value.length;
    const isArrowDown = e.key === 'ArrowDown';
    const currentTaskId = lastSelectedTaskId.value ?? (parentTasks.value[isArrowDown ? 0 : taskLength - 1].id);

    let currentIndex;
    if (typeof lastSelectedTaskId.value === 'number')
        currentIndex = parentTasks.value.findIndex(task => task.id === lastSelectedTaskId.value);
    else
        currentIndex = isArrowDown ? -1 : taskLength;

    const nextIndex = currentIndex + (isArrowDown ? 1 : -1);
    if (nextIndex < 0 || nextIndex >= taskLength)
        return;

    const nextTaskId = parentTasks.value[nextIndex].id;

    if (e.shiftKey && (e.metaKey || e.ctrlKey) && selectedTaskIds.value.length === 1) {
        // const oldIndex = selectedIndexes.value[0];
        // const newIndex = oldIndex + (isArrowDown ? 1 : -1);
        // swapTask(oldIndex, newIndex);
    }
    else if (e.shiftKey) {
        if (selectedTaskIds.value.includes(nextTaskId))
            selectedTaskIds.value = selectedTaskIds.value.filter(id => id !== currentTaskId);
        else
            selectedTaskIds.value.push(nextTaskId);
    }
    else {
        selectTask(nextTaskId);
    }
});

onKeyStroke(['Esc', 'Escape'], () => {
    selectTask([]);
});

const {editTask} = useTasksStore();
onKeyStroke('Enter', () => {
    if (typeof lastSelectedTaskId.value === 'number') {
        const taskToEdit = parentTasks.value.find(task => task.id === lastSelectedTaskId.value);
        if (taskToEdit)
            editTask(taskToEdit);
    }
}, {eventName: 'keyup'});

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
    trashTasks(tasks, selectedTaskIndexes.value);

    if (selectedTaskIds.value.length > 1)
        selectTask(0);
});
</script>

<template>
    <div>
        <div
            id="undone-task-list"
            ref="list"
            v-on-click-outside="onClickOutside"
            :class="pomodoroIsEnabled ? '-ml-8' : '-ml-2'"
        >
            <TaskItem
                v-for="(task, i) in parentTasks"
                :key="task.id"
                v-model="parentTasks[i]"
                :aria-selected="selectedTaskIds.includes(task.id)"
                class="task-item"
                :is-last-selected="lastSelectedTaskId === task.id"
                :is-selected="selectedTaskIds.includes(task.id)"
                @click="onTaskClick(task.id, $event)"
                @dblclick="editTask(task)"
                @dragstart="selectTask(task.id)"
            />
        </div>

        <div
            v-if="parentDoneTasks.length"
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
                    v-for="(task, i) in parentDoneTasks"
                    :key="task.id"
                    v-model="parentDoneTasks[i]"
                    :class="pomodoroIsEnabled ? '-ml-8' : '-ml-2'"
                    @dblclick="editTask(task)"
                />
            </template>
        </div>
    </div>
</template>
