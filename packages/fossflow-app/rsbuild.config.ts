import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
    plugins: [pluginReact()],
    output: {
        distPath: {
            root: 'build',
        },
        // https://rsbuild.rs/guide/advanced/browser-compatibility
        polyfill: 'usage',
        assetPrefix: process.env.PUBLIC_URL || '/',
    }
});
