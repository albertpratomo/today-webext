<script setup lang="ts">
import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/vue';
</script>

<template>
    <Menu
        as="div"
        class="relative inline-block"
    >
        <MenuButton class="p-1">
            ...
        </MenuButton>

        <Transition name="fade-up">
            <MenuItems class="absolute w-40 flex flex-col bg-white">
                <MenuItem v-slot="{active}">
                    <button
                        class="p-2"
                        :class="[
                            active ? 'bg-gray-500 text-white' : 'text-gray-900',
                        ]"
                    >
                        Move to

                        <Transition name="fade-up">
                            <div
                                v-if="active"
                                class="absolute left-full top-0 h-20 w-40 bg-white p-1 text-left text-black"
                            >
                                Submenu
                            </div>
                        </Transition>
                    </button>
                </MenuItem>

                <MenuItem v-slot="{active}">
                    <button
                        class="p-2"
                        :class="[
                            active ? 'bg-gray-500 text-white' : 'text-gray-900',
                        ]"
                    >
                        When
                    </button>
                </MenuItem>
            </MenuItems>
        </Transition>
    </Menu>
</template>
