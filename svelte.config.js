import adapter from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
    compilerOptions: {
        experimental: {
            async: true
        },
        modernAst: true,
        preserveComments: false,
        preserveWhitespace: false,
        runes: true
    },
    // vitePlugin: {
    //     dynamicCompileOptions({ filename, compileOptions }) {
    //         if (disableRunes(filename) && compileOptions.runes) {
    //             return { runes: false }
    //         }
    //     }
    // },
    kit: {
        adapter: adapter({
            config: './wrangler.jsonc',
            routes: {
                exclude: ['<all>'],
                include: ['/*']
            }
        }),
        inlineStyleThreshold: Infinity,
        output: {
            bundleStrategy: 'inline'
            // preloadStrategy: 'preload-mjs',
        }
        // router: {
        //     type: 'pathname',
        //     resolution: 'client'
        // }
    },
    // Consult https://svelte.dev/docs/kit/integrations
    // for more information about preprocessors
    preprocess: vitePreprocess()
}

export default config
