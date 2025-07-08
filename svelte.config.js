import adapter from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://svelte.dev/docs/kit/integrations
    // for more information about preprocessors
    preprocess: vitePreprocess(),
    compilerOptions: {
        runes: true,
        preserveComments: false,
        preserveWhitespace: false,
        modernAst: true
    },

    kit: {
        output: {
            bundleStrategy: 'inline'
        },
        adapter: adapter({
            config: './wrangler.jsonc'
        }),
        inlineStyleThreshold: Infinity
    }
}

export default config
