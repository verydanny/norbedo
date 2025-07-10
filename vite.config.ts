import devtoolsJson from 'vite-plugin-devtools-json'
import tailwindcss from '@tailwindcss/vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    plugins: [tailwindcss(), sveltekit(), devtoolsJson()],
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
                pure_funcs: ['console.log'],
                passes: 2
            },
            mangle: {
                toplevel: true
            }
        },
        chunkSizeWarningLimit: 1000,
        assetsInlineLimit: 4096
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
