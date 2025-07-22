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
        runes: true,
        css: 'injected'
    },
    vitePlugin: {
        dynamicCompileOptions({ filename, compileOptions }) {
            if (disableRunes(filename) && compileOptions.runes) {
                return { runes: false }
            }
        }
    },
    kit: {
        output: {
            bundleStrategy: 'inline' // Reverted to 'inline' to minimize requests
        },
        adapter: adapter({
            config: './wrangler.jsonc',
            routes: {
                include: ['/*'],
                exclude: ['<all>']
            }
        }),
        inlineStyleThreshold: Infinity // Reverted to inline CSS to minimize requests
    }
}

export default config
