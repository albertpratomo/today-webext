<script setup lang="ts">
// TODO: Maybe refactor to use https://www.radix-vue.com/components/context-menu.html.
// It is open-source component and supports keyboard navigation already.
import {onKeyStroke} from '~/utils/onKeyStroke';

export interface ContextMenuItem {
    action?: () => void
    divider?: boolean
    icon?: string
    text: string
    shortcut?: string
    selected?: ComputedRef<boolean>
    submenu?: {
        text?: string
        items: ContextMenuItem[]
    }
}

interface Props {
    menuItems: ContextMenuItem[]
    parentElement: HTMLElement | null
}

const props = defineProps<Props>();

const activeIndex = ref<number | null>(null);

const isVisible = ref(false);
const container = ref<HTMLElement | null>(null);
const menuPosition = reactive({top: '0px', left: '0px'});

function handleContextMenu(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (props.parentElement && props.parentElement.contains(target)) {
        event.preventDefault();
        openContextMenu(event);
    }

    // close all contextMenu's excluding the current one
    if (props.parentElement && !props.parentElement.contains(target)) {
        if (container.value && !container.value.contains(target))
            closeContextMenu();
    }
}

function openContextMenu(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (container.value && container.value.contains(target))
        return;

    const x = event.clientX + 5;
    const y = event.clientY + 5;
    isVisible.value = true;
    menuPosition.top = `${y}px`;
    menuPosition.left = `${x}px`;
}

function closeContextMenu() {
    isVisible.value = false;
    activeIndex.value = null;
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
        <div class="w-40 flex flex-col border border-gray-700 rounded bg-gray-800 py-1 shadow-sm">
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
                    @mouseenter="activeIndex = i"
                    @mouseleave="activeIndex = null"
                >
                    <button
                        class="mx-1 flex grow rounded py-2 pl-2 pr-0.25 text-left text-gray-300"
                        :class="{'bg-gray-750': activeIndex === i}"
                        @click="item.action"
                    >
                        <div class="grow">
                            {{ item.text }}
                        </div>

                        <div
                            v-if="item.shortcut"
                            class="ml-2 text-gray-400"
                        >
                            {{ item.shortcut }}
                        </div>

                        <div v-if="item.submenu">
                            <MaterialSymbolsArrowRight class="ml-1.5 h-4 text-[16px] text-gray-400" />
                        </div>
                    </button>

                    <Transition name="fade">
                        <div
                            v-if="item.submenu"
                            v-show="activeIndex === i"
                            class="absolute left-full top-[-5px] min-w-40 border border-color-[#39394D] rounded bg-gray-800 p-1 text-gray-200 shadow-sm"
                        >
                            <div
                                v-if="item.submenu.text"
                                class="p-1.5 text-gray-400"
                            >
                                {{ item.submenu.text }}
                            </div>

                            <button
                                v-for="(submenuItem, j) in item.submenu.items"
                                :key="j"
                                class="block w-full flex rounded p-2 pl-0.5 text-left hover:bg-gray-750"
                                @click="submenuItem.action"
                            >
                                <div class="mr-1 h-4 w-4 flex items-center text-gray-400">
                                    <MaterialSymbolsCheck v-if="submenuItem.selected && submenuItem.selected.value" />
                                </div>

                                <Icon
                                    v-if="submenuItem.icon"
                                    class="mr-2"
                                    :name="submenuItem.icon"
                                />

                                <div class="grow">
                                    {{ submenuItem.text }}
                                </div>

                                <div
                                    v-if="submenuItem.shortcut"
                                    class="ml-2 text-gray-400"
                                >
                                    {{ submenuItem.shortcut }}
                                </div>
                            </button>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>
    </div>
</template>
