import devtoolsJson from 'vite-plugin-devtools-json'
import tailwindcss from '@tailwindcss/vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'
import { FontaineTransform } from 'fontaine'

export default defineConfig({
    plugins: [
        tailwindcss(),
        sveltekit(),
        devtoolsJson(),
        FontaineTransform.vite({
            fallbacks: ['BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'Noto Sans'],
            resolvePath: (id) => {
                return new URL(`./static${id}`, import.meta.url)
            }
        })
    ],
    build: {
        minify: 'terser',
        terserOptions: {
            safari10: false,
            ecma: 2020,
            format: {
                comments: false
            },
            compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: [
                    'console.log',
                    'console.warn',
                    'console.error',
                    'console.info',
                    'console.debug'
                ],
                passes: 2,
                keep_fargs: false,
                pure_getters: true,
                hoist_funs: true,
                hoist_props: true,
                hoist_vars: false,
                if_return: true,
                join_vars: true,
                collapse_vars: true,
                reduce_vars: true,
                negate_iife: true,
                pure_new: true
            },
            mangle: {
                toplevel: true,
                safari10: false
            }
        },
        chunkSizeWarningLimit: 4096,
        assetsInlineLimit: 8192
    },
    test: {
        projects: [
            {
                extends: './vite.config.ts',
                test: {
                    name: 'client',
                    environment: 'browser',
                    browser: {
                        enabled: true,
                        headless: true,
                        provider: 'playwright',
                        instances: [{ browser: 'chromium' }]
                    },
                    include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
                    exclude: ['src/lib/server/**'],
                    setupFiles: ['./vitest-setup-client.ts']
                }
            },
            {
                extends: './vite.config.ts',
                test: {
                    name: 'server',
                    environment: 'node',
                    include: ['src/**/*.{test,spec}.{js,ts}'],
                    exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
                }
            }
        ]
    }
})
