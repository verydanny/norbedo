<script lang="ts">
    import { enhance } from '$app/forms'
    import { invalidate } from '$app/navigation'

    const { data } = $props()
    const { user } = $derived(data)
</script>

{#await user}
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div class="flex justify-center">
            <div
                class="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"
            ></div>
        </div>
    </div>
{:then user}
    {#if user}
        <ul>
            <li>
                <strong>Email:</strong>
                {user.email}
            </li>
            <li>
                <strong>Name:</strong>
                {user.name}
            </li>
            <li>
                <strong>ID:</strong>
                {user.$id}
            </li>
        </ul>

        <form
            method="post"
            use:enhance={async () => {
                return async ({ result }) => {
                    if (result.type === 'redirect') {
                        await invalidate('app:user')
                    }
                }
            }}
        >
            <button type="submit">Log out</button>
        </form>
    {/if}
{:catch error}
    <p>Error: {error}</p>
{/await}
