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
        'inset-center': 'absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2',
    },
    theme: {
        boxShadow: {
            'indigo-emerald': '-4px -4px 4px 0px rgba(55, 48, 163, 0.12), 4px 4px 4px 0px rgba(6, 95, 70, 0.12)',
            'button': '0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 1px 3px 0px rgba(0, 0, 0, 0.10), 0px 0.5px 0px 0.5px rgba(255, 255, 255, 0.15) inset',
            'button-clicked': '0px -0.8px 0px 0px rgba(255, 255, 255, 0.20) inset, 0px 2px 2px 0.5px rgba(0, 0, 0, 0.25) inset',
            'keyboard': '0px 1px 0px 0.25px rgba(0, 0, 0, 0.25), 0px 0.75px 0px 0.25px rgba(255, 255, 255, 0.12) inset;',
        },
        colors: {
            gray: {
                50: '#F8F9FC',
                100: '#ECEDFA',
                200: '#E0E1EC',
                300: '#D7D8E0',
                350: '#AAAAB8',
                400: '#9090A8',
                500: '#62657A',
                600: '#474B66',
                700: '#3C3D53',
                750: '#313242',
                800: '#252732',
                850: '#1C1D24',
                900: '#16171F',
                950: '#12131A',
            },
            green: {
                900: '#133122',
            },
            indigo: {
                150: '#CFD8FC',
                950: '#22223F',
            },
            red: {
                500: '#C84345',
                550: '#AE3436',
                600: '#802320',
            },
        },
        fontFamily: {
            sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        },
        fontSize: {
            '2sm': ['0.8125rem', '1.25rem'], // 13px, 20px
            '2xs': ['0.688rem', '1rem'], // 11px, 16px
        },
    },
});
