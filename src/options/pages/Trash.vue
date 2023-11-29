<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {useTrashStore} from '~/stores/trash';

const {tasks} = storeToRefs(useTrashStore());
</script>

<template>
    <LayoutSidebar>
        <div class="h-full flex overflow-auto">
            <div class="min-w-0 flex grow justify-center px-8 py-10 pb-3 md:px-11">
                <div class="max-w-[960px] min-w-0 grow">
                    <h1 class="h-8 text-xl font-medium">
                        {{ $t('pageTitle.trash') }}
                    </h1>

                    <TaskList
                        v-model="tasks"
                        class="mt-8 pb-10"
                    />
                </div>
            </div>

            <div class="hidden w-[200px] shrink-0 lg:w-70 md:w-60 md:flex" />
        </div>
    </LayoutSidebar>
</template>
