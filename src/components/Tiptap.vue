<script setup lang="ts">
import {EditorContent, useEditor} from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';

const modelValue = defineModel();

const editor = useEditor({
    content: modelValue.value,
    editorProps: {
        attributes: {
            class: 'prose',
        },
    },
    extensions: [
        StarterKit,
        TaskList.configure({
            HTMLAttributes: {
                class: '',
            },
        }),
        TaskItem.configure({
            HTMLAttributes: {
                class: 'flex gap-2 not-prose',
            },
            nested: true,
        }),
    ],
    onUpdate({editor}) {
        modelValue.value = editor.getHTML();
    },
});
</script>

<template>
    <EditorContent :editor="editor" />
</template>
