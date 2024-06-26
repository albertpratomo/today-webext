<script setup lang="ts">
import {moveArrayElement, useSortable} from '@vueuse/integrations/useSortable';
import {useHistoryStore, useTasksStore, useTrashStore} from '~/stores';
import type {SortableEvent} from 'sortablejs';
import type Task from '~/models/Task';
import {onKeyStroke} from '~/utils/onKeyStroke';
import {pomodoroIsEnabled} from '~/utils/featureToggle';
import {storeToRefs} from 'pinia';

interface Props {
    tasks: Task[]
    doneTasks?: Task[]
}
const {tasks, doneTasks = []} = defineProps<Props>();

const {t} = useI18n();

const {tasks: allTasks, selectedTaskIds} = storeToRefs(useTasksStore());

const lastSelectedTaskId = computed(() => selectedTaskIds.value.at(-1));

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
        const clickedIndex = tasks.findIndex(task => task.id === clicked);
        const lastIndex = lastSelectedTaskId.value !== null
            ? tasks.findIndex(task => task.id === lastSelectedTaskId.value)
            : clickedIndex; // Fallback to clickedIndex if lastSelectedTaskId is null

        const minIndex = Math.min(clickedIndex, lastIndex);
        const maxIndex = Math.max(clickedIndex, lastIndex);

        const rangeTaskIds = tasks.slice(minIndex, maxIndex + 1).map(task => task.id);

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

    const taskLength = tasks.length;
    const isArrowDown = e.key === 'ArrowDown';
    const currentTaskId = lastSelectedTaskId.value ?? (tasks[isArrowDown ? 0 : taskLength - 1].id);

    let currentIndex;
    if (typeof lastSelectedTaskId.value === 'number')
        currentIndex = tasks.findIndex(task => task.id === lastSelectedTaskId.value);
    else
        currentIndex = isArrowDown ? -1 : taskLength;

    const nextIndex = currentIndex + (isArrowDown ? 1 : -1);
    if (nextIndex < 0 || nextIndex >= taskLength)
        return;

    const nextTaskId = tasks[nextIndex].id;

    if (e.shiftKey && (e.metaKey || e.ctrlKey) && selectedTaskIds.value.length === 1) {
        const oldIndex = currentIndex;
        const newIndex = oldIndex + (isArrowDown ? 1 : -1);
        swapTask(oldIndex, newIndex);
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

const {editTask, taskById, scheduleTask} = useTasksStore();
onKeyStroke('Enter', () => {
    if (typeof lastSelectedTaskId.value === 'number') {
        const task = taskById(lastSelectedTaskId.value);
        if (task)
            editTask(task);
    }
}, {eventName: 'keyup'});

onKeyStroke(['t', 'T'], () => {
    // If a dialog is open, ignore
    if (document.querySelector('[role=dialog][data-headlessui-state=open]'))
        return;

    if (selectedTaskIds.value.length) {
        selectedTaskIds.value.forEach((taskId) => {
            const task = taskById(taskId);
            if (task)
                scheduleTask(task, 'today');
        });
    }
});

const list = ref<HTMLElement | null>(null);
useSortable(list, tasks, {
    handle: '.drag-handle',
    onUpdate: async (e: SortableEvent) => {
        swapTask(e.oldIndex!, e.newIndex!);
    },
});

async function swapTask(oldIndex: number, newIndex: number) {
    const taskId = tasks[oldIndex].id;
    const parentOldIndex = allTasks.value.findIndex(task => task.id === taskId);

    const secondTaskId = tasks[newIndex].id;
    const parentNewIndex = allTasks.value.findIndex(task => task.id === secondTaskId);

    if (parentNewIndex >= 0 && parentNewIndex < allTasks.value.length) {
        moveArrayElement(allTasks.value, parentOldIndex, parentNewIndex);
        await nextTick();
        useHistoryStore().commit();
    }
}

const showDoneTasks = ref(false);
const toggleText = computed(() => {
    const key = showDoneTasks.value ? 'hide' : 'show';
    return t(`actions.${key}CompletedTasks`);
});

const {removeTasks} = useTrashStore();
onKeyStroke(['Backspace', 'Delete'], () => {
    // If a dialog is open, don't delete any task.
    if (document.querySelector('[role=dialog][data-headlessui-state=open]'))
        return;

    if (selectedTaskIds.value.length) {
        removeTasks(selectedTaskIds.value);

        selectTask([]);
    }
});
</script>

<template>
    <div>
        <div
            v-show="tasks.length"
            ref="list"
            v-on-click-outside="onClickOutside"
            class="mb-12"
            :class="pomodoroIsEnabled ? '-ml-8' : '-ml-2'"
        >
            <TaskItem
                v-for="(task, i) in tasks"
                :key="task.id"
                v-model="tasks[i]"
                :aria-selected="selectedTaskIds.includes(task.id)"
                class="task-item"
                :is-last-selected="lastSelectedTaskId === task.id"
                :is-selected="selectedTaskIds.includes(task.id)"
                @click="onTaskClick(task.id, $event)"
                @contextmenu="onTaskClick(task.id, $event)"
                @dblclick="editTask(task)"
                @dragstart="selectTask(task.id)"
            />
        </div>

        <div v-show="doneTasks.length">
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
                    :class="pomodoroIsEnabled ? '-ml-8' : '-ml-2'"
                    @dblclick="editTask(task)"
                />
            </template>
        </div>
    </div>
</template>
