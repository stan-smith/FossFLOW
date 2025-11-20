import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
    plugins: [pluginReact()],
    html: {
        template: './public/index.html',
        templateParameters: {
            assetPrefix: process.env.PUBLIC_URL ? (process.env.PUBLIC_URL.endsWith('/') ? process.env.PUBLIC_URL : process.env.PUBLIC_URL + '/') : '/',
        },
    },
    output: {
        distPath: {
            root: 'build',
        },
        // https://rsbuild.rs/guide/advanced/browser-compatibility
        polyfill: 'usage',
        assetPrefix: process.env.PUBLIC_URL ? (process.env.PUBLIC_URL.endsWith('/') ? process.env.PUBLIC_URL : process.env.PUBLIC_URL + '/') : '/',
        copy: [
            {
                from: './src/i18n',
                to: 'i18n/app',
            },
        ]
    }
});
