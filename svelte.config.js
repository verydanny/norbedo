import adapter from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

function disableRunes(filename) {
    return filename.includes('node_modules')
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://svelte.dev/docs/kit/integrations
    // for more information about preprocessors
    preprocess: vitePreprocess(),
    compilerOptions: {
        experimental: {
            async: true
        },
        preserveComments: false,
        preserveWhitespace: false,
        modernAst: true,
        runes: true
    },
    vitePlugin: {
        dynamicCompileOptions({ filename, compileOptions }) {
            if (disableRunes(filename) && compileOptions.runes) {
                console.log('Disabling runes for', filename)
                return { runes: false }
            }
        }
    },
    kit: {
        output: {
            bundleStrategy: 'inline'
            // preloadStrategy: 'preload-mjs'
        },
        adapter: adapter({
            config: './wrangler.jsonc'
        }),
        inlineStyleThreshold: Infinity
        // router: {
        //     type: 'pathname',
        //     resolution: 'server'
        // }
    }
}

export default config
