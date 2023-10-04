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
        'btn-icon': 'inline-block px-2 py-1 bg-gray-700 border rounded disabled:opacity-60',
        'inset-center': 'absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2',
    },
    theme: {
        boxShadow: {
            'indigo-emerald': '-4px -4px 4px 0px rgba(55, 48, 163, 0.12), 4px 4px 4px 0px rgba(6, 95, 70, 0.12)',
            'button': '0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 1px 3px 0px rgba(0, 0, 0, 0.10), 0px 0.5px 0px 0.5px rgba(255, 255, 255, 0.15) inset',
            'button-clicked': '0px -0.8px 0px 0px rgba(255, 255, 255, 0.20) inset, 0px 2px 2px 0.5px rgba(0, 0, 0, 0.25) inset',
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
                850: '#191A21',
                900: '#16171F',
                950: '#12131A',
            },
            green: {
                900: '#133122',
            },
            cocoa: {
                200: '#F7CEBC', // text
                600: '#5C3E31', // bg-pressed
                700: '#5E473D', // bg-hovered
                800: '#3C2921', // bg-default
            },
            flamingo: {
                200: '#FFC3CF', // text
                600: '#94383E', // bg-pressed
                700: '#7A414B', // bg-hovered
                800: '#6E2E3A', // bg-default
            },
            tomato: {
                200: '#EFB4B4', // text
                600: '#5C2121', // bg-pressed
                700: '#703535', // bg-hovered
                800: '#572121', // bg-default
            },
            tangerine: {
                200: '#F7CDB5', // text
                600: '#AB4729', // bg-pressed
                700: '#824B3A', // bg-hovered
                800: '#6D3423', // bg-default
            },
            pumpkin: {
                200: '#F8D1B5', // text
                600: '#A35B24', // bg-pressed
                700: '#795234', // bg-hovered
                800: '#643F23', // bg-default
            },
            mango: {
                200: '#FBE6BD', // text
                600: '#CC801B', // bg-pressed
                700: '#9B7845', // bg-hovered
                800: '#825D26', // bg-default
            },
            eucalyptus: {
                200: '#A5D0BC', // text
                600: '#256B49', // bg-pressed
                700: '#375C4B', // bg-hovered
                800: '#234535', // bg-default
            },
            basil: {
                200: '#B6F0C5', // text
                600: '#376643', // bg-pressed
                700: '#43644C', // bg-hovered
                800: '#2D4935', // bg-default
            },
            pistachio: {
                200: '#C4EEB5', // text
                600: '#31711B', // bg-pressed
                700: '#447034', // bg-hovered
                800: '#315425', // bg-default
            },
            avocado: {
                200: '#EDF1B3', // text
                600: '#78821F', // bg-pressed
                700: '#767944', // bg-hovered
                800: '#5E6132', // bg-default
            },
            citron: {
                200: '#F1E5B2', // text
                600: '#997B04', // bg-pressed
                700: '#7E6D24', // bg-hovered
                800: '#65571C', // bg-default
            },
            banana: {
                200: '#F7E5B7', // text
                600: '#AC8B17', // bg-pressed
                700: '#7B6C34', // bg-hovered
                800: '#574B23', // bg-default
            },
            sage: {
                200: '#AEEBE7', // text
                600: '#248373', // bg-pressed
                700: '#32655F', // bg-hovered
                800: '#1D544E', // bg-default
            },
            peacock: {
                200: '#BDD6FC', // text
                600: '#2F5FA8', // bg-pressed
                700: '#305880', // bg-hovered
                800: '#1B4269', // bg-default
            },
            cobalt: {
                200: '#B2C3FF', // text
                600: '#3858C9', // bg-pressed
                700: '#3D4E8D', // bg-hovered
                800: '#2A3D82', // bg-default
            },
            blueberry: {
                200: '#C7C2F4', // text
                600: '#3E3799', // bg-pressed
                700: '#3E387A', // bg-hovered
                800: '#2D2863', // bg-default
            },
            lavender: {
                200: '#BCB6FA', // text
                600: '#544EA1', // bg-pressed
                700: '#45417A', // bg-hovered
                800: '#373367', // bg-default
            },
            wisteria: {
                200: '#CFAEF9', // text
                600: '#836BB7', // bg-pressed
                700: '#615487', // bg-hovered
                800: '#483A72', // bg-default
            },
            graphite: {
                200: '#C6C6C6', // text
                600: '#5B5B5B', // bg-pressed
                700: '#464646', // bg-hovered
                800: '#313131', // bg-default
            },
            birch: {
                200: '#F3DDC2', // text
                600: '#85755F', // bg-pressed
                700: '#6F6457', // bg-hovered
                800: '#574A3A', // bg-default
            },
            radicchio: {
                200: '#FFC5DC', // text
                600: '#AB3A67', // bg-pressed
                700: '#984667', // bg-hovered
                800: '#822A4D', // bg-default
            },
            cherry: {
                200: '#FFA6C2', // text
                600: '#AE4163', // bg-pressed
                700: '#813B51', // bg-hovered
                800: '#822B46', // bg-default
            },
            grape: {
                200: '#CDAFF1', // text
                600: '#5A2E8F', // bg-pressed
                700: '#523673', // bg-hovered
                800: '#412166', // bg-default
            },
            amethyst: {
                200: '#E2B2F7', // text
                600: '#7C4F90', // bg-pressed
                700: '#5D3F6B', // bg-hovered
                800: '#50305E', // bg-default
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
