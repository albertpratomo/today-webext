import {defineConfig} from 'unocss/vite';
import {
    presetAttributify, presetIcons,
    presetUno, transformerDirectives,
} from 'unocss';

export default defineConfig({
    presets: [
        presetAttributify(),
        presetIcons(),
        presetUno(),
    ],
    transformers: [
        transformerDirectives(),
    ],
});
