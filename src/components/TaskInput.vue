<script setup lang="ts">
import {EditorContent, useEditor} from '@tiptap/vue-3';
import Code from '@tiptap/extension-code';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';

const modelValue = defineModel<string>({required: true});

const editor = useEditor({
    autofocus: 'end',
    content: modelValue.value,
    editorProps: {
        attributes: {
            class: 'focus:outline-none',
        },
    },
    extensions: [
        Code,
        Document,
        Paragraph,
        Text,
    ],
    onUpdate({editor}) {
        modelValue.value = editor.getHTML();
    },
});
</script>

<template>
    <EditorContent :editor="editor" />
</template>
