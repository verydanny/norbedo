<script lang="ts">
    import '../app.css'
    import { onMount } from 'svelte'
    import Shell from '$lib/components/Shell.svelte'
    import { dev } from '$app/environment'

    let { children } = $props()

    onMount(() => {
        if (dev) {
            navigator.serviceWorker.register('/service-worker.js', {
                type: 'module'
            })
        }
    })
</script>

<Shell>
    {@render children()}
</Shell>
