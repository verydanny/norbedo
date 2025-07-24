<script lang="ts">
import '../app.css'
import type { Snippet } from 'svelte'
import { dev } from '$app/environment'
import PrimaryColumn from '$lib/components/PrimaryColumnLayout.svelte'
import SecondaryColumn from '$lib/components/SecondaryColumnLayout.svelte'

let { children }: { children: Snippet } = $props()

if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    addEventListener('load', () => {
        if (dev) {
            navigator.serviceWorker.register('/service-worker.js', {
                type: 'module'
            })
        } else {
            navigator.serviceWorker.register('/service-worker.js')
        }
    })
}
</script>

<PrimaryColumn>
    {@render children()}
</PrimaryColumn>

<SecondaryColumn>
    <p>Secondary column</p>
</SecondaryColumn>
