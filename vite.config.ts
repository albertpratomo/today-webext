/// <reference types="vitest" />

import {dirname, relative} from 'node:path';
import {isDev, port, r} from './scripts/utils';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import UnoCSS from 'unocss/vite';
import type {UserConfig} from 'vite';
import Vue from '@vitejs/plugin-vue';
import VueI18n from '@intlify/unplugin-vue-i18n/vite';
import {defineConfig} from 'vite';
import packageJson from './package.json';

export const sharedConfig: UserConfig = {
    root: r('src'),
    resolve: {
        alias: {
            '~/': `${r('src')}/`,
        },
    },
    define: {
        __DEV__: isDev,
        __NAME__: JSON.stringify(packageJson.name),
    },
    plugins: [
        Vue({
            script: {
                defineModel: true,
                propsDestructure: true,
            },
        }),

        AutoImport({
            imports: [
                'vitest',
                'vue',
                'vue-i18n',
                {
                    'webextension-polyfill': [
                        ['*', 'browser'],
                    ],
                },
            ],
            dts: r('src/auto-imports.d.ts'),
        }),

        // https://github.com/antfu/unplugin-vue-components
        Components({
            dirs: [r('src/components')],
            // generate `components.d.ts` for ts support with Volar
            dts: r('src/components.d.ts'),
            resolvers: [
                // auto import icons
                IconsResolver({
                    componentPrefix: '',
                }),
            ],
        }),

        // https://github.com/antfu/unplugin-icons
        Icons(),

        // https://github.com/unocss/unocss
        UnoCSS(),

        // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
        VueI18n({
            runtimeOnly: true,
            compositionOnly: true,
            fullInstall: true,
            include: [r('src/i18n/en')],
        }),

        // rewrite assets to use relative path
        {
            name: 'assets-rewrite',
            enforce: 'post',
            apply: 'build',
            transformIndexHtml(html, {path}) {
                return html.replace(/"\/assets\//g, `"${relative(dirname(path), '/assets')}/`);
            },
        },
    ],
    optimizeDeps: {
        include: [
            'vue',
            '@vueuse/core',
            'webextension-polyfill',
        ],
        exclude: [
            'vue-demi',
        ],
    },
};

export default defineConfig(({command}) => ({
    ...sharedConfig,
    base: command === 'serve' ? `http://localhost:${port}/` : '/dist/',
    server: {
        port,
        hmr: {
            host: 'localhost',
        },
    },
    build: {
        watch: isDev
            ? {}
            : undefined,
        outDir: r('extension/dist'),
        emptyOutDir: false,
        sourcemap: isDev ? 'inline' : false,
        target: 'esnext',
        // https://developer.chrome.com/docs/webstore/program_policies/#:~:text=Code%20Readability%20Requirements
        terserOptions: {
            mangle: false,
        },
        rollupOptions: {
            input: {
                options: r('src/options/index.html'),
                popup: r('src/popup/index.html'),
            },
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
    },
}));
