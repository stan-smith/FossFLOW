import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

const publicUrl = process.env.PUBLIC_URL || '';
const assetPrefix = publicUrl ? (publicUrl.endsWith('/') ? publicUrl : publicUrl + '/') : '/';

export default defineConfig({
    plugins: [pluginReact()],
    html: {
        template: './public/index.html',
        templateParameters: {
            assetPrefix: assetPrefix,
        },
    },
    source: {
        // Define global constants that will be replaced at build time
        define: {
            'process.env.PUBLIC_URL': JSON.stringify(publicUrl),
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
        },
    },
    output: {
        distPath: {
            root: 'build',
        },
        // https://rsbuild.rs/guide/advanced/browser-compatibility
        polyfill: 'usage',
        assetPrefix: assetPrefix,
        copy: [
            {
                from: './src/i18n',
                to: 'i18n/app',
            },
        ]
    }
});
