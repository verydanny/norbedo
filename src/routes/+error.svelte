<script lang="ts">
    import { onMount } from 'svelte'
    import { page } from '$app/state'
    import { resolve } from '$app/paths'
    import Code from '$lib/components/Code.svelte'

    const errorMessage = $derived(page.error?.message || 'Page not found')
    const errorDetails = $derived(page.error ? JSON.stringify(page.error, null, 0) : '')
    const statusCode = $derived(page.status || 404)

    let leftEye: HTMLElement
    let rightEye: HTMLElement
    let currentMouseX = $state(globalThis.innerWidth * 0.6)
    let currentMouseY = $state(globalThis.innerHeight * 0.4)

    const updateEyePosition = (clientX: number, clientY: number) => {
        if (!leftEye || !rightEye) {
            return
        }

        ;[leftEye, rightEye].forEach((eye) => {
            const rect = eye.getBoundingClientRect()
            const eyeCenterX = rect.left + rect.width / 2
            const eyeCenterY = rect.top + rect.height / 2
            const angle = Math.atan2(clientY - eyeCenterY, clientX - eyeCenterX)
            const pupil = eye.querySelector('.pupil') as HTMLElement

            if (pupil) {
                const distance = Math.min(rect.width * 0.2, rect.height * 0.2)
                pupil.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`
            }
        })
    }

    const handleMouseMove = (e: MouseEvent) => {
        currentMouseX = e.clientX
        currentMouseY = e.clientY
        updateEyePosition(currentMouseX, currentMouseY)
    }

    onMount(() => {
        document.addEventListener('mousemove', handleMouseMove)
        return () => document.removeEventListener('mousemove', handleMouseMove)
    })
</script>

<div
    class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800 p-4"
>
    <div class="space-y-8 text-center">
        <!-- Eyes Container -->
        <div class="mb-8 flex items-center justify-center gap-4 sm:gap-8 md:gap-12">
            <!-- Left Eye (Normal Size) -->
            <div
                bind:this={leftEye}
                class="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-purple-300 bg-white shadow-2xl sm:h-28 sm:w-28 sm:border-4 md:h-32 md:w-32"
            >
                <div
                    class="pupil h-8 w-8 rounded-full bg-black transition-transform duration-100 ease-out sm:h-10 sm:w-10 md:h-12 md:w-12"
                ></div>
            </div>

            <!-- Right Eye (1.5x Bigger) -->
            <div
                bind:this={rightEye}
                class="relative flex items-center justify-center overflow-hidden rounded-full border-2 border-purple-300 bg-white shadow-2xl sm:border-4"
                style="width: 7.5rem; height: 7.5rem;"
            >
                <div
                    class="pupil rounded-full bg-black transition-transform duration-100 ease-out"
                    style="width: 3rem; height: 3rem;"
                ></div>
            </div>
        </div>

        <!-- Error Content -->
        <div class="space-y-4">
            <h1 class="text-6xl font-bold text-white drop-shadow-lg sm:text-7xl md:text-8xl">
                {statusCode}
            </h1>
            <h2 class="text-xl font-semibold text-purple-100 sm:text-2xl">Oops! {errorMessage}</h2>
        </div>

        <!-- Error Details Code Block -->
        {#if errorDetails}
            <Code code={errorDetails} />
        {/if}

        <!-- Action Button -->
        <div class="pt-6">
            <a
                href={resolve('/')}
                class="btn btn-primary btn-lg transform shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl"
            >
                Go Back Home
            </a>
        </div>
    </div>
</div>
