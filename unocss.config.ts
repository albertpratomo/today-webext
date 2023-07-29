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
    shortcuts: {
        'btn': 'inline-block px-4 py-1.5 rounded text-sm font-medium disabled:opacity-60',
        'btn-gray': 'btn bg-gray-500 text-gray-100',
        'btn-indigo': 'btn bg-indigo-500 text-gray-100',
        'btn-icon': 'inline-block px-2 py-1 bg-gray-700 border border-gray-600 rounded disabled:opacity-60',
    },
    theme: {
        colors: {
            gray: {
                50: '#F8F9FC',
                100: '#ECEDFA',
                200: '#E0E1EC',
                300: '#D2D3E0',
                400: '#9090A8',
                500: '#62657A',
                600: '#474B66',
                700: '#3C3D53',
                800: '#252732',
                850: '#191A21',
                900: '#12121A',
            },
        },
    },
});
