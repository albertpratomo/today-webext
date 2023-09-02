import {presetAttributify, presetTypography, presetUno, transformerDirectives} from 'unocss';
import {defineConfig} from 'unocss/vite';
import {presetForms} from '@julr/unocss-preset-forms';

export default defineConfig({
    presets: [
        presetAttributify(),
        presetForms(),
        presetTypography(),
        presetUno(),
    ],
    transformers: [
        transformerDirectives(),
    ],
    shortcuts: {
        'btn': 'inline-block px-4 py-1.5 rounded text-sm font-medium disabled:opacity-60',
        'btn-gray': 'btn bg-gray-500 text-gray-100',
        'btn-indigo': 'btn bg-indigo-500 text-gray-100',
        'btn-icon': 'inline-block px-2 py-1 bg-gray-700 border rounded disabled:opacity-60',
        'inset-center': 'absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2',
    },
    theme: {
        boxShadow: {
            'indigo-emerald': '-4px -4px 4px 0px rgba(55, 48, 163, 0.12), 4px 4px 4px 0px rgba(6, 95, 70, 0.12)',
        },
        colors: {
            gray: {
                50: '#F8F9FC',
                100: '#ECEDFA',
                200: '#E0E1EC',
                300: '#D2D3E0',
                350: '#AAAAB8',
                400: '#9090A8',
                500: '#62657A',
                600: '#474B66',
                700: '#3C3D53',
                800: '#252732',
                850: '#191A21',
                900: '#16171F',
                950: '#12131A',
            },
            green: {
                900: '#133122',
            },
        },
        fontFamily: {
            sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        },
        fontSize: {
            '2sm': ['0.8125rem', '1.25rem'], // 13px, 20px
        },
    },
});
