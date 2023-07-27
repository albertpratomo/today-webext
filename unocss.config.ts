import {presetAttributify, presetUno, transformerDirectives} from 'unocss';
import {defineConfig} from 'unocss/vite';

export default defineConfig({
    presets: [
        presetAttributify(),
        presetUno(),
    ],
    transformers: [
        transformerDirectives(),
    ],
});
