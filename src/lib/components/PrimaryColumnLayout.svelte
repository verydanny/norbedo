<script lang="ts">
    import type { Snippet } from 'svelte'
    import Sidebar from './Sidebar.svelte'
    import type { LayoutData } from '../../routes/$types.d.ts'

    let { children, user }: { children: Snippet; user: LayoutData['user'] } = $props()
</script>

<Sidebar {user} />

<main class="lg:pl-72">
    <div class="xl:pr-96">
        <div class="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
            {@render children()}
        </div>
    </div>
</main>
