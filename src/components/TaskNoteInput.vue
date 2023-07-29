<script setup lang="ts">
import {EditorContent, useEditor} from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';

const modelValue = defineModel<string>({required: true}); ;

const editor = useEditor({
    autofocus: 'end',
    content: modelValue.value,
    editorProps: {
        attributes: {
            'class': 'focus:outline-none',
            'data-placeholder': 'Add notes',
        },
    },
    extensions: [
        StarterKit,
    ],
    onUpdate({editor}) {
        modelValue.value = editor.getHTML();
    },
});
</script>

<template>
    <EditorContent :editor="editor" />
</template>

<style scoped>
:deep(.ProseMirror:has(p:only-child > br:only-child):before) {
    @apply text-gray-400 float-left pointer-events-none h-0;
    content: attr(data-placeholder);
}
</style>
