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
            class: 'focus:outline-none',
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
        class="gray-300 flex-1 overflow-hidden text-sm leading-5 caret-indigo-400"
        :editor="editor"
    />
</template>
