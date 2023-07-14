<script setup lang="ts">
import {EditorContent, useEditor} from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';

const editor = useEditor({
    content: '<p>I’m running Tiptap with Vue.js. 🎉</p>',
    extensions: [
        StarterKit,
        TaskList.configure({
            HTMLAttributes: {
                class: 'flex flex-col gap-1',
            },
        }),
        TaskItem.configure({
            HTMLAttributes: {
                class: 'flex gap-2',
            },
            nested: true,
        }),
    ],
});
</script>

<template>
    <EditorContent :editor="editor" />
</template>
