import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import path from 'path';

const publicUrl = process.env.PUBLIC_URL || '';
const assetPrefix = publicUrl ? (publicUrl.endsWith('/') ? publicUrl : publicUrl + '/') : '/';

// Resolve React from root node_modules to avoid duplicate instances
const rootNodeModules = path.resolve(__dirname, '../../node_modules');
const fossflowLib = path.resolve(__dirname, '../fossflow-lib');

const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
    plugins: [pluginReact()],
    server: isDev
        ? {
              proxy: {
                  '/api/ai-proxy/gemini': {
                      target: 'https://generativelanguage.googleapis.com',
                      changeOrigin: true,
                      pathRewrite: { '^/api/ai-proxy/gemini': '/' },
                  },
                  '/api/ai-proxy/openai': {
                      target: 'https://api.openai.com',
                      changeOrigin: true,
                      pathRewrite: { '^/api/ai-proxy/openai': '/' },
                  },
                  '/api/ai-proxy/anthropic': {
                      target: 'https://api.anthropic.com',
                      changeOrigin: true,
                      pathRewrite: { '^/api/ai-proxy/anthropic': '/' },
                  },
                  '/api/ai-proxy/openrouter': {
                      target: 'https://openrouter.ai',
                      changeOrigin: true,
                      pathRewrite: { '^/api/ai-proxy/openrouter': '/' },
                  },
              },
          }
        : undefined,
    resolve: {
        alias: {
            // Force React to resolve from root node_modules
            'react': path.join(rootNodeModules, 'react'),
            'react-dom': path.join(rootNodeModules, 'react-dom'),
            // Resolve fossflow to workspace package (app may not have it in its own node_modules)
            'fossflow': fossflowLib,
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
