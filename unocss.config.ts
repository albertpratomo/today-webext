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
            indigo: {
                150: '#CFD8FC',
                950: '#22223F',
            },
            green: {
                900: '#133122',
            },
            red: {
                500: '#C84345',
                550: '#AE3436',
                600: '#802320',
            },
            cocoa: {
                200: '#E9D0C5', // text
                600: '#50372C', // bg pressed
                650: '#422E26', // bg hover
                700: '#3C2921', // bg default
            },
            flamingo: {
                200: '#FFD1D7', // text
                600: '#94383E', // bg pressed
                650: '#75323F', // bg hover
                700: '#692A35', // bg default
            },
            tomato: {
                200: '#FFB2B2', // text
                600: '#7D1F1F', // bg pressed
                650: '#5E2121', // bg hover
                700: '#4F1A1A', // bg default
            },
            tangerine: {
                200: '#FFE4C9', // text
                600: '#9C4125', // bg
                650: '#6E3221', // bg hover
                700: '#5E2F22', // bg default
            },
            pumpkin: {
                200: '#FFE8B9', // text
                600: '#964F20', // bg
                650: '#633D20', // bg hover
                700: '#59381F', // bg default
            },
            mango: {
                200: '#FFFFB1', // text
                600: '#A36818', // bg
                650: '#805617', // bg hover
                700: '#6B4915', // bg default
            },
            eucalyptus: {
                200: '#BEFFE2', // text
                600: '#256B49', // bg
                650: '#26523D', // bg hover
                700: '#244737', // bg default
            },
            basil: {
                200: '#D0FFDC', // text
                600: '#376643', // bg
                650: '#31523A', // bg hover
                700: '#2C4733', // bg default
            },
            pistachio: {
                200: '#CAFFB4', // text
                600: '#31711B', // bg
                650: '#2F5424', // bg hover
                700: '#2E4F23', // bg default
            },
            avocado: {
                200: '#FFFFB8', // text
                600: '#6D781D', // bg
                650: '#5A5E2F', // bg hover
                700: '#4F522A', // bg default
            },
            citron: {
                200: '#FFFFBF', // text
                600: '#8C7000', // bg
                650: '#635516', // bg hover
                700: '#594C15', // bg default
            },
            banana: {
                200: '#FFFFB8', // text
                600: '#8A6C1F', // bg
                650: '#6E570B', // bg hover
                700: '#634D03', // bg default
            },
            sage: {
                200: '#BAFFF9', // text
                600: '#1E665A', // bg
                650: '#1E5953', // bg hover
                700: '#1C524C', // bg default
            },
            peacock: {
                200: '#C8F8FF', // text
                600: '#2F5FA8', // bg
                650: '#193F6B', // bg hover
                700: '#183D61', // bg default
            },
            cobalt: {
                200: '#C9E7FF', // text
                600: '#2A46A8', // bg
                650: '#29398A', // bg hover
                700: '#222F73', // bg default
            },
            blueberry: {
                200: '#D7D0FF', // text
                600: '#3E3799', // bg active
                650: '#352F70', // bg hover
                700: '#322D64', // bg default
            },
            lavender: {
                200: '#E8D8FF', // text
                600: '#4F3F9E', // bg
                650: '#433778', // bg hover
                700: '#3A3066', // bg default
            },
            wisteria: {
                200: '#FBE3FF', // text
                600: '#836BB7', // bg
                650: '#4A387A', // bg hover
                700: '#403266', // bg default
            },
            graphite: {
                200: '#E1E2E2', // text
                600: '#5B5B5B', // bg
                650: '#353536', // bg hover
                700: '#2E2E2E', // bg default
            },
            birch: {
                200: '#FFFFF8', // text
                600: '#806B50', // bg
                650: '#614E38', // bg hover
                700: '#544532', // bg default
            },
            radicchio: {
                200: '#FFD3FF', // text
                600: '#AB3A67', // bg
                650: '#6B1F3B', // bg hover
                700: '#611E39', // bg default
            },
            cherry: {
                200: '#FFDAFC', // text
                600: '#AE4163', // bg
                650: '#73253F', // bg hover
                700: '#6B243C', // bg default
            },
            grape: {
                200: '#F3C7FF', // text
                600: '#5A2E8F', // bg
                650: '#3E2069', // bg hover
                700: '#3D2061', // bg default
            },
            amethyst: {
                200: '#FFE8FF', // text
                600: '#7C4F90', // bg
                650: '#4D2E5C', // bg hover
                700: '#452A52', // bg default
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
