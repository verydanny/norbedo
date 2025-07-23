// import devtoolsJson from 'vite-plugin-devtools-json'
import tailwindcss from '@tailwindcss/vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'
// import { FontaineTransform } from 'fontaine'

export default defineConfig((env) => {
    const production = env.mode === 'production'

    return {
        plugins: [
            sveltekit(),
            tailwindcss()
            // devtoolsJson(),
            // FontaineTransform.vite({
            //     fallbacks: ['BlinkMacSystemFont', 'Segoe UI'],
            //     resolvePath: (id) => {
            //         return new URL(`./static${id}`, import.meta.url)
            //     }
            // })
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
        // css: {
        //     lightningcss: {
        //         targets: {
        //             chrome: 135,
        //             safari: 18
        //         }
        //     }
        // },
        build: {
            modulePreload: {
                polyfill: false
            },
            target: 'esnext',
            minify: production ? 'esbuild' : false,
            cssMinify: 'lightningcss',
            chunkSizeWarningLimit: 4096,
            assetsInlineLimit: 0
        }
        // rollupOptions: production
        //     ? {
        //           output: {
        //               inlineDynamicImports: true
        //           }
        //       }
        //     : {},
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
