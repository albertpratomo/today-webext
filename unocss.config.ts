import {defineConfig} from 'unocss/vite';
import {presetAttributify, presetUno, transformerDirectives} from 'unocss';

export default defineConfig({
    presets: [
        presetAttributify(),
        presetUno(),
    ],
    transformers: [
        transformerDirectives(),
    ],
});
