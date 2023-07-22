<script setup lang="ts">
import {EditorContent, useEditor} from '@tiptap/vue-3';
import Code from '@tiptap/extension-code';
import Text from '@tiptap/extension-text';
import {Node} from '@tiptap/core';

const modelValue = defineModel<string>({required: true}); ;

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
            class: 'focus:outline-none',
        },
    },
    extensions: [
        Code,
        Document,
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
