import {isDev, isFirefox, port, r} from '../scripts/utils';
import type {Manifest} from 'webextension-polyfill';
import type PkgType from '../package.json';
import fs from 'fs-extra';

interface WebExtensionManifest extends Manifest.WebExtensionManifest {
    key: string
    oauth2: {
        client_id: string
    }
}

export async function getManifest() {
    const pkg = await fs.readJSON(r('package.json')) as typeof PkgType;

    // update this file to update this manifest.json
    // can also be conditional based on your need
    const manifest: WebExtensionManifest = {
        manifest_version: 3,
        key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvAzqGSh1qjO1nh3LTPUNIeZSUiH9o/24Zzvf4cQ/T6T3p1xtavVdHbQygp4JmbDwhnQRoT4CzGDBkyDh297lWDtZrS4Fgqz3/+8LrH/AHfp3ckWfAta7pRlKWz8ek/5ijQ4oTF/i3Ft4IvF11P2Ba8TovVBaNd8TAX++tBKHE5bwO4bcTXFn7ZV1FFhb/5K4NJ5kF86f/grHT5cYCFSdchftpUEBHMBbRWgy403nfYhNhLhezwSZTS+Au3giaZcIoCJSYxfLrDNZGjtDjjfJg28t2G2DiDuP8Jz19wb+Pp3hiVGMBYPGstjcSx8nwcB8t3J472xfSaxh8CIkYpD94wIDAQAB',
        name: pkg.displayName || pkg.name,
        version: pkg.version,
        description: pkg.description,
        action: {
            default_icon: './assets/icon-128.png',
            // default_popup: './dist/popup/index.html',
        },
        options_ui: {
            page: './dist/options/index.html',
            open_in_tab: true,
        },
        background: isFirefox
            ? {
                scripts: ['dist/background/index.mjs'],
                type: 'module',
            }
            : {
                service_worker: './dist/background/index.mjs',
            },
        icons: {
            16: './assets/icon-128.png',
            48: './assets/icon-128.png',
            128: './assets/icon-128.png',
        },
        permissions: [
            // 'tabs',
            'identity',
            'storage',
            // 'activeTab',
        ],
        oauth2: {
            client_id: '1021613980165-vefd6a9hcsshq6uhasigrn42555c4eav.apps.googleusercontent.com',
        },
        // host_permissions: ['*://*/*'],
        // content_scripts: [
        //     {
        //         matches: [
        //             '<all_urls>',
        //         ],
        //         js: [
        //             'dist/contentScripts/index.global.js',
        //         ],
        //     },
        // ],
        // web_accessible_resources: [
        //     {
        //         resources: ['dist/contentScripts/style.css'],
        //         matches: ['<all_urls>'],
        //     },
        // ],
        content_security_policy: {
            extension_pages: isDev
                // this is required on dev for Vite script to load
                ? `script-src \'self\' http://localhost:${port}; object-src \'self\'`
                : 'script-src \'self\'; object-src \'self\'',
        },
        chrome_url_overrides: {
            newtab: './dist/options/index.html',
        },
    };

    // FIXME: not work in MV3
    if (isDev && false) {
        // for content script, as browsers will cache them for each reload,
        // we use a background script to always inject the latest version
        // see src/background/contentScriptHMR.ts
        delete manifest.content_scripts;
        manifest.permissions?.push('webNavigation');
    }

    return manifest;
}
