<script setup lang="ts">
import type ContextMenuItem from '~/models/ContextMenuItem';
import {onKeyStroke} from '~/utils/onKeyStroke';

const props = defineProps({
    menuItems: {
        type: Array as PropType<ContextMenuItem[]>,
        default: () => [],
    },
    parentElement: {
        type: Object as PropType<HTMLElement | null>,
        default: null,
    },
});

// Create a reactive copy of menuItems
const reactiveMenuItems = reactive(props.menuItems.map(item => ({...item, active: false})));

function setActive(index: number, value: boolean) {
    reactiveMenuItems[index].active = value;
}

// Expose the reactive menu items to the template
const {menuItems} = toRefs({menuItems: reactiveMenuItems});

const isVisible = ref(false);
const container = ref<HTMLElement | null>(null);
const menuPosition = reactive({top: '0px', left: '0px'});

function handleContextMenu(event: MouseEvent) {
    if (props.parentElement && props.parentElement.contains(event.target)) {
        event.preventDefault();
        openContextMenu(event);
    }

    // close all contextMenu's excluding the current one
    if (props.parentElement && !props.parentElement.contains(event.target)) {
        if (container.value && !container.value.contains(event.target))
            closeContextMenu();
    }
}

function openContextMenu(event: MouseEvent) {
    if (container.value && container.value.contains(event.target))
        return;

    const x = event.clientX + 5;
    const y = event.clientY + 5;
    isVisible.value = true;
    menuPosition.top = `${y}px`;
    menuPosition.left = `${x}px`;
}

function closeContextMenu() {
    isVisible.value = false;

    menuItems.value.forEach((item) => {
        item.active = false;
    });
}

onKeyStroke(['Esc', 'Escape'], () => {
    closeContextMenu();
});

onMounted(() => {
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('resize', closeContextMenu);
});

onBeforeUnmount(() => {
    window.removeEventListener('contextmenu', handleContextMenu);
    window.removeEventListener('resize', closeContextMenu);
});
</script>

<template>
    <div
        v-if="isVisible"
        ref="container"
        v-on-click-outside="closeContextMenu"
        class="fixed z-[9999]"
        :style="menuPosition"
        @click="closeContextMenu"
    >
        <div class="w-40 flex flex-col border border-color-[#39394D] rounded bg-gray-800 py-1 shadow-sm">
            <div
                v-for="(item, i) in menuItems"
                :key="i"
            >
                <div
                    v-if="item.divider"
                    class="mx-2 my-1 border-t"
                />

                <div
                    class="relative flex text-xs"
                    @mouseenter="setActive(i, true)"
                    @mouseleave="setActive(i, false)"
                >
                    <button
                        class="mx-1 flex grow rounded p-2 text-left text-gray-300"
                        :class="{'bg-gray-750': item.active}"
                        @click="item.action"
                    >
                        <div class="grow">
                            {{ item.text }}
                        </div>

                        <div v-if="item.submenu">
                            <MaterialSymbolsArrowRight class="h-4 text-[16px] text-gray-400" />
                        </div>
                    </button>

                    <Transition name="fade">
                        <div
                            v-if="item.submenu"
                            v-show="item.active"
                            class="absolute left-full top-[-5px] min-w-40 border border-color-[#39394D] rounded bg-gray-800 p-1 text-gray-200 shadow-sm"
                        >
                            <div
                                v-if="item.submenu.text"
                                class="p-[6px] text-gray-400"
                            >
                                {{ item.submenu.text }}
                            </div>

                            <button
                                v-for="(submenuItem, j) in item.submenu.items"
                                :key="j"
                                class="block w-full flex rounded p-2 pl-[2px] text-left hover:bg-gray-750"
                                @click="submenuItem.action"
                            >
                                <div class="mr-1 h-4 w-4 flex items-center text-gray-400">
                                    <MaterialSymbolsCheck v-if="submenuItem.selected" />
                                </div>

                                <Icon
                                    v-if="submenuItem.icon"
                                    class="mr-2"
                                    :name="submenuItem.icon"
                                />
                                {{ submenuItem.text }}
                            </button>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>
    </div>
</template>
