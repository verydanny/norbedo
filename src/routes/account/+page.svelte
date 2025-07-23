<script lang="ts">
    const { data } = $props()
    const { user } = data
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

        <form method="post">
            <button type="submit">Log out</button>
        </form>
    {/if}
{:catch error}
    <p>Error: {error}</p>
{/await}
