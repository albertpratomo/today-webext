import {defineConfig} from 'unocss/vite';
import {
    presetAttributify, presetIcons, presetTypography,
    presetUno, transformerDirectives,
} from 'unocss';

export default defineConfig({
    presets: [
        presetAttributify(),
        presetIcons(),
        presetUno(),
        presetTypography(),
    ],
    transformers: [
        transformerDirectives(),
    ],
});
