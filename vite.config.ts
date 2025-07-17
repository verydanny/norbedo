import devtoolsJson from 'vite-plugin-devtools-json'
import tailwindcss from '@tailwindcss/vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'
import { enhancedImages } from '@sveltejs/enhanced-img'
import { FontaineTransform } from 'fontaine'

export default defineConfig((env) => {
    const production = env.mode === 'production'

    return {
        plugins: [
            enhancedImages(),
            sveltekit(),
            tailwindcss(),
            FontaineTransform.vite({
                fallbacks: ['BlinkMacSystemFont', 'Segoe UI'],
                resolvePath: (id) => {
                    return new URL(`./static${id}`, import.meta.url)
                }
            }),
            devtoolsJson()
        ],
        esbuild: production
            ? {
                  minifyIdentifiers: true,
                  minifySyntax: true,
                  minifyWhitespace: true,
                  drop: ['console', 'debugger'],
                  treeShaking: true,
                  legalComments: 'none'
              }
            : {},
        build: {
            minify: production ? 'esbuild' : false,
            chunkSizeWarningLimit: 4096,
            assetsInlineLimit: Infinity
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
    }
})
