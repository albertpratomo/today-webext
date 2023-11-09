<script setup lang="ts">
import {EditorContent, useEditor} from '@tiptap/vue-3';
import Heading from '@tiptap/extension-heading';
import StarterKit from '@tiptap/starter-kit';

const {t} = useI18n();

const modelValue = defineModel<string>({required: true}); ;

const editor = useEditor({
    content: modelValue.value,
    editorProps: {
        attributes: {
            'class': 'focus:outline-none prose',
            'data-placeholder': t('fields.taskNote.placeholder'),
        },
    },
    extensions: [
        StarterKit,
        Heading.configure({
            levels: [1, 2, 3, 4, 5],
        }),
    ],
    onUpdate({editor}) {
        modelValue.value = editor.getHTML();
    },
});

watch(modelValue, (val) => {
    if (editor.value && editor.value.getHTML() !== val)
        editor.value.commands.setContent(val, false);
});
</script>

<template>
    <EditorContent
        class="text-sm"
        :editor="editor"
    />
</template>

<style scoped>
:deep(.ProseMirror:has(> p:only-child > br:only-child):before) {
    @apply text-gray-400 float-left pointer-events-none h-0;
    content: attr(data-placeholder);
}
</style>
