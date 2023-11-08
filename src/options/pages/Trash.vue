<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useTrashStore} from '~/stores/trash';

const {tasks} = storeToRefs(useTrashStore());
</script>

<template>
    <LayoutSidebar>
        <div class="flex">
            <div class="flex grow justify-center px-8 pb-3 pt-12 md:px-11">
                <div class="max-w-[960px] grow">
                    <h1 class="h-8 text-xl font-medium">
                        {{ $t('trash') }}
                    </h1>

                    <TaskList
                        v-model="tasks"
                        class="mt-8"
                    />
                </div>
            </div>

            <div class="hidden w-[200px] shrink-0 lg:w-70 md:w-60 md:flex" />
        </div>
    </LayoutSidebar>
</template>
