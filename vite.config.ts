import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import devtoolsJson from 'vite-plugin-devtools-json'
import { defineConfig } from 'vitest/config'
// import { FontaineTransform } from 'fontaine'

export default defineConfig(({ mode }) => {
    const production = mode === 'production'

    return {
        build: {
            assetsInlineLimit: 0,
            chunkSizeWarningLimit: 4096,
            cssMinify: 'lightningcss',
            minify: production ? 'esbuild' : false,
            modulePreload: {
                polyfill: false
            },
            target: 'esnext'
        },
        css: {
            lightningcss: {
                targets: {
                    chrome: 135,
                    safari: 18
                }
            }
        },
        esbuild: production
            ? {
                  legalComments: 'none',
                  minifyIdentifiers: true,
                  minifySyntax: true,
                  minifyWhitespace: true,
                  treeShaking: true
              }
            : {},
        plugins: [
            sveltekit(),
            tailwindcss(),
            devtoolsJson()
            // FontaineTransform.vite({
            //     fallbacks: ['BlinkMacSystemFont', 'Segoe UI'],
            //     resolvePath: (id) => {
            //         return new URL(`./static${id}`, import.meta.url)
            //     }
            // })
        ],
        rollupOptions: production
            ? {
                  output: {
                      inlineDynamicImports: true
                  }
              }
            : {}
        // test: {
        //     projects: [
        //         {
        //             extends: './vite.config.ts',
        //             test: {
        //                 name: 'client',
        //                 environment: 'browser',
        //                 browser: {
        //                     enabled: true,
        //                     headless: true,
        //                     provider: 'playwright',
        //                     instances: [{ browser: 'chromium' }]
        //                 },
        //                 include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
        //                 exclude: ['src/lib/server/**'],
        //                 setupFiles: ['./vitest-setup-client.ts']
        //             }
        //         },
        //         {
        //             extends: './vite.config.ts',
        //             test: {
        //                 name: 'server',
        //                 environment: 'node',
        //                 include: ['src/**/*.{test,spec}.{js,ts}'],
        //                 exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
        //             }
        //         }
        //     ]
        // }
    }
})
