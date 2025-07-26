import adapter from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

// function disableRunes(filename) {
//     return filename.includes('node_modules')
// }

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
        output: {
            bundleStrategy: 'single'
            // preloadStrategy: 'preload-mjs'
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
