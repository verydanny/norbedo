<script lang="ts">
let { code }: { code: string } = $props()
let copied = $state(false)

const lines = code.split('\n')

const copyToClipboard = async () => {
    try {
        await navigator.clipboard.writeText(code)
        copied = true
        setTimeout(() => {
            copied = false
        }, 2000)
    } catch (err) {
        console.error('Failed to copy text:', err)
    }
}
</script>

<div class="bg-base-200 mockup-code w-full">
    <button
        class="btn btn-xs absolute top-2 right-2"
        class:btn-success={copied}
        onclick={copyToClipboard}
    >
        {copied ? '✓ Copied!' : '📋 Copy'}
    </button>
    {#each lines as line, index}
        <pre data-prefix={index + 1}><code>{line}</code></pre>
    {/each}
</div>
