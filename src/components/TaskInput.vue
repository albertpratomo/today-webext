<script setup lang="ts">
import {EditorContent, useEditor} from '@tiptap/vue-3';
import Text from '@tiptap/extension-text';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';

const modelValue = defineModel<string>({required: true});

const editor = useEditor({
    content: modelValue.value,
    extensions: [
        Document,
        Paragraph,
        Text,
    ],
    onUpdate({editor}) {
        modelValue.value = editor.getText();
    },
});
</script>

<template>
    <EditorContent :editor="editor" />
</template>
