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
                750: '#363742',
                800: '#252732',
                850: '#1C1D24',
                900: '#16171F',
                950: '#12131A',
            },
            indigo: {
                150: '#CFD8FC',
                950: '#22223F',
            },
            green: {
                900: '#133122',
            },
            cocoa: {
                200: '#F7CEBC', // text
                600: '#5C3E31', // bg
            },
            flamingo: {
                200: '#FFC3CF', // text
                600: '#94383E', // bg
            },
            tomato: {
                200: '#EFB4B4', // text
                600: '#5C2121', // bg
            },
            tangerine: {
                200: '#F7CDB5', // text
                600: '#AB4729', // bg
            },
            pumpkin: {
                200: '#F8D1B5', // text
                600: '#A35B24', // bg
            },
            mango: {
                200: '#FBE6BD', // text
                600: '#CC801B', // bg
            },
            eucalyptus: {
                200: '#A5D0BC', // text
                600: '#256B49', // bg
            },
            basil: {
                200: '#B6F0C5', // text
                600: '#376643', // bg
            },
            pistachio: {
                200: '#C4EEB5', // text
                600: '#31711B', // bg
            },
            avocado: {
                200: '#EDF1B3', // text
                600: '#78821F', // bg
            },
            citron: {
                200: '#F1E5B2', // text
                600: '#997B04', // bg
            },
            banana: {
                200: '#F7E5B7', // text
                600: '#AC8B17', // bg
            },
            sage: {
                200: '#AEEBE7', // text
                600: '#216C60', // bg
            },
            peacock: {
                200: '#BDD6FC', // text
                600: '#2F5FA8', // bg
            },
            cobalt: {
                200: '#B2C3FF', // text
                600: '#3858C9', // bg
            },
            blueberry: {
                200: '#D8D5FA', // text
                600: '#3E3799', // bg active
                650: '#352F70', // bg hover
                700: '#322D64', // bg default
            },
            lavender: {
                200: '#BCB6FA', // text
                600: '#544EA1', // bg
            },
            wisteria: {
                200: '#CFAEF9', // text
                600: '#836BB7', // bg
            },
            graphite: {
                200: '#C6C6C6', // text
                600: '#5B5B5B', // bg
            },
            birch: {
                200: '#F3DDC2', // text
                600: '#85755F', // bg
            },
            radicchio: {
                200: '#FFC5DC', // text
                600: '#AB3A67', // bg
            },
            cherry: {
                200: '#FEBDD2', // text
                600: '#AE4163', // bg
            },
            grape: {
                200: '#CDAFF1', // text
                600: '#5A2E8F', // bg
            },
            amethyst: {
                200: '#E2B2F7', // text
                600: '#7C4F90', // bg
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
