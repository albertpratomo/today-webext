<script setup lang="ts">
import {EditorContent, useEditor} from '@tiptap/vue-3';
import {Node} from '@tiptap/core';
import Text from '@tiptap/extension-text';

const props = withDefaults(
    defineProps<{
        isEditable?: boolean
        isFocused?: boolean
    }>(),
    {
        isEditable: true,
        isFocused: false,
    },
);

const emit = defineEmits(['blur', 'focus']);

const {t} = useI18n();

const modelValue = defineModel<string>({required: true});

const Document = Node.create({
    name: 'doc',
    topNode: true,
    content: 'text*',
});

const editor = useEditor({
    editable: props.isEditable,
    content: modelValue.value,
    editorProps: {
        attributes: {
            'class': 'focus:outline-none',
            'data-placeholder': t('fields.subtaskTitle.placeholder'),
        },
    },
    extensions: [
        Document,
        Text,
    ],
    onUpdate({editor}) {
        modelValue.value = editor.getHTML();
    },
    onFocus() {
        emit('focus');
    },
    onBlur() {
        emit('blur');
    },
});

watch(modelValue, (val) => {
    if (editor.value && editor.value.getHTML() !== val)
        editor.value.commands.setContent(val, false);
});

watchEffect(() => {
    if (editor.value) {
        if (props.isEditable && props.isFocused && !editor.value.isFocused)
            editor.value.commands.focus('end');

        if (props.isEditable !== editor.value.isEditable)
            editor.value.setEditable(props.isEditable);
    }
});
</script>

<template>
    <EditorContent
        class="flex-1 overflow-hidden text-lg"
        :editor="editor"
    />
</template>

<style scoped>
:deep(.ProseMirror:has(> br:only-child):before) {
    @apply text-gray-400 float-left pointer-events-none h-0;
    content: attr(data-placeholder);
}
</style>
