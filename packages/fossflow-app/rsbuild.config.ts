import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import path from 'path';

const publicUrl = process.env.PUBLIC_URL || '';
const assetPrefix = publicUrl ? (publicUrl.endsWith('/') ? publicUrl : publicUrl + '/') : '/';

// Resolve React from root node_modules to avoid duplicate instances
const rootNodeModules = path.resolve(__dirname, '../../node_modules');

export default defineConfig({
    plugins: [pluginReact()],
    resolve: {
        alias: {
            // Force React to resolve from root node_modules
            'react': path.join(rootNodeModules, 'react'),
            'react-dom': path.join(rootNodeModules, 'react-dom'),
        },
    },
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
