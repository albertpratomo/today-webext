<script setup lang="ts">
import {EditorContent, useEditor} from '@tiptap/vue-3';
import {Extension, Node} from '@tiptap/core';
import Text from '@tiptap/extension-text';
import {storeToRefs} from 'pinia';
import {useTasksStore} from '~/stores';

const prop = defineProps<{
    index: number
}>();

const emit = defineEmits(['keyboardArrowUp', 'keyboardArrowDown']);

const {t} = useI18n();

const modelValue = defineModel<string>({required: true});
const {selectedSubtasks, lastSelectedSubtask} = storeToRefs(useTasksStore());

const Document = Node.create({
    name: 'doc',
    topNode: true,
    content: 'text*',
});

const overrideKeyboardDefaults = Extension.create({
    name: 'overrideKeyboardDefaults',
    addKeyboardShortcuts() {
        return {
            ArrowUp: () => {
                emit('keyboardArrowUp');
            },
            ArrowDown: () => {
                emit('keyboardArrowDown');
            },
        };
    },
});

const editor = useEditor({
    content: modelValue.value,
    editorProps: {
        attributes: {
            'class': 'focus:outline-none',
            'data-placeholder': t('fields.subtaskTitle.placeholder'),
        },
    },
    extensions: [
        Document,
        Text,
        overrideKeyboardDefaults,
    ],
    onUpdate({editor}) {
        modelValue.value = editor.getHTML();
    },
    onFocus() {
        if (selectedSubtasks.value.includes(prop.index) === false)
            selectedSubtasks.value = [prop.index];
    },
    onBlur() {
        selectedSubtasks.value = [];
    },
});

watch(modelValue, (val) => {
    if (editor.value && editor.value.getHTML() !== val)
        editor.value.commands.setContent(val, false);
});

watchEffect(() => {
    if (editor.value && lastSelectedSubtask.value === prop.index && editor.value.isFocused === false)
        editor.value.commands.focus('end');
});
</script>

<template>
    <EditorContent
        class="flex-1 overflow-hidden text-lg"
        :editor="editor"
    />
</template>

<style scoped>
:deep(.ProseMirror:has(> br:only-child):before) {
    @apply text-gray-400 float-left pointer-events-none h-0;
    content: attr(data-placeholder);
}
</style>
