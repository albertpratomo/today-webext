<script setup lang="ts">
import {EditorContent, useEditor} from '@tiptap/vue-3';
import Bold from '@tiptap/extension-bold';
import Code from '@tiptap/extension-code';
import History from '@tiptap/extension-history';
import Italic from '@tiptap/extension-italic';
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
</script>

<template>
    <EditorContent :editor="editor" />
</template>
