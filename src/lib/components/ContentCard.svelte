<script lang="ts">
    import type { Snippet } from 'svelte'

    let { children, title, footer }: { children: Snippet; title: string; footer: string } = $props();
</script>

<div class="bg-secondary divide-neutral mb-10 divide-y overflow-hidden rounded-lg shadow-md">
    <div class=" px-4 py-5 text-lg font-bold sm:px-6">
        <p>{title}</p>
    </div>
    <div class="px-4 py-5 sm:p-6">
        {@render children()}
    </div>
    <div class="px-4 py-4 sm:px-6">
        <p class="text-base-content/70 text-sm">{footer}</p>
    </div>
</div>
