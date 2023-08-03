<script setup lang="ts">
import {EditorContent, useEditor} from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';

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
        TaskItem.configure({nested: true}),
        TaskList,
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
