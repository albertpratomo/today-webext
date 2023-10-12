<script setup lang="ts">
import {EditorContent, useEditor} from '@tiptap/vue-3';
import Bold from '@tiptap/extension-bold';
import Code from '@tiptap/extension-code';
import History from '@tiptap/extension-history';
import Italic from '@tiptap/extension-italic';
import {Node} from '@tiptap/core';
import Text from '@tiptap/extension-text';

const props = withDefaults(
    defineProps<{
        isFocused?: boolean
    }>(),
    {
        isFocused: false,
    },
);

const {t} = useI18n();

const modelValue = defineModel<string>({required: true});

const Document = Node.create({
    name: 'doc',
    topNode: true,
    content: 'text*',
});

const editor = useEditor({
    autofocus: 'end',
    content: modelValue.value,
    editorProps: {
        attributes: {
            'class': 'focus:outline-none',
            'data-placeholder': t('fields.taskTitle.placeholder'),
        },
    },
    extensions: [
        Bold,
        Code,
        Document,
        History,
        Italic,
        Text,
    ],
    onUpdate({editor}) {
        modelValue.value = editor.getHTML();
    },
});

watch(modelValue, (val) => {
    if (editor.value && editor.value.getHTML() !== val)
        editor.value.commands.setContent(val, false);
});

watchEffect(() => {
    if (props.isFocused && editor.value && !editor.value.isFocused)
        editor.value.commands.focus('end');
});
</script>

<template>
    <EditorContent
        class="overflow-hidden text-lg"
        :editor="editor"
    />
</template>

<style scoped>
:deep(.ProseMirror:has(> br:only-child):before) {
    @apply text-gray-400 float-left pointer-events-none h-0;
    content: attr(data-placeholder);
}
</style>
