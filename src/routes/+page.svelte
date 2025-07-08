<script lang="ts">
    import LoadingScreenMinimal from '$lib/components/LoadingScreenMinimal.svelte';
</script>

<div class="flex h-screen flex-col items-center justify-center">
    <div class="prose prose-sm md:prose-base w-full max-w-4xl grow pt-10">
        <div class="card bg-base-100 card-xl w-full shadow-sm">
            <div class="card-body">
                <LoadingScreenMinimal />
            </div>
        </div>
    </div>
</div>
