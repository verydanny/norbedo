<script lang="ts">
    import '../app.css'
    import type { Snippet } from 'svelte'
    import type { LayoutData } from './$types.d.ts'
    import { dev } from '$app/environment'
    import PrimaryColumn from '$lib/components/PrimaryColumnLayout.svelte'
    import SecondaryColumn from '$lib/components/SecondaryColumnLayout.svelte'

    let { children, data }: { children: Snippet; data: LayoutData } = $props()
    let { user } = $derived(data)

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

<PrimaryColumn {user}>
    {@render children()}
</PrimaryColumn>

<SecondaryColumn>
    <p>Secondary column</p>
</SecondaryColumn>
