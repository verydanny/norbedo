<script lang="ts">
import { browser } from '$app/environment'
import { preloadData } from '$app/navigation'
import { intersectionObserver } from '$lib/actions/intersecting/use-intersection-observer.svelte'
import { resolve } from '$app/paths'

let touchStartX = 0
let touchStartY = 0
let swipeDirection: 'horizontal' | 'vertical' | null = null
let lastMoveX = 0
let lastMoveTime = 0
let velocity = 0

let isOpen = $state(false)
let isDragging = $state(false)
let currentTranslateX = $state(0)

let sidebarWidth = $state(320)
let sidebarPanel: HTMLDivElement | undefined

const openSidebar = () => {
    isOpen = true
}

/**
 * We preload the data for the pages that are shown in the sidebar.
 * This is to preload not on hover, but when menu is opened. This lets
 * us split application while keeping data load on server, but it still
 * feels fast.
 */
const preloadSidebar = () => {
    Promise.allSettled([preloadData('/auth/signin')])
}

const closeSidebar = () => {
    isOpen = false
}

const handleKeydown = (event: KeyboardEvent) => event.key === 'Escape' && isOpen && closeSidebar()

const handleBackgroundInteraction = (event: Event) => {
    // Close sidebar if the click is on the background itself, not on the panel.
    if (event.currentTarget === event.target) {
        closeSidebar()
    }
}

$effect(() => {
    if (!browser) {
        return
    }

    if (sidebarPanel) {
        sidebarWidth = sidebarPanel.clientWidth
    }

    if (isOpen) {
        document.body.classList.add('overflow-hidden')
    } else {
        document.body.classList.remove('overflow-hidden')
    }

    // Cleanup when the component is destroyed
    return () => {
        if (browser) {
            document.body.classList.remove('overflow-hidden')
        }
    }
})

const handleTouchStart = (e: TouchEvent) => {
    if (!isOpen) {
        return
    }

    touchStartX = e?.touches[0]?.clientX ?? 0
    touchStartY = e?.touches[0]?.clientY ?? 0
    isDragging = true
    swipeDirection = null

    // Reset velocity tracking
    lastMoveX = touchStartX
    lastMoveTime = performance.now()
    velocity = 0
}

const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) {
        return
    }

    const deltaX = (e?.touches[0]?.clientX ?? 0) - touchStartX
    const deltaY = (e?.touches[0]?.clientY ?? 0) - touchStartY

    if (swipeDirection === null) {
        swipeDirection = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical'
    }

    if (swipeDirection === 'horizontal') {
        const currentX = e?.touches[0]?.clientX ?? 0
        const now = performance.now()
        const timeDelta = now - lastMoveTime

        if (timeDelta > 0) {
            const moveDelta = currentX - lastMoveX
            velocity = moveDelta / timeDelta
        }

        lastMoveX = currentX
        lastMoveTime = now

        // Emulate iOS rubber band effect
        if (deltaX > 0) {
            // Dragging right from open position (overscroll)
            currentTranslateX = deltaX ** 0.7
        } else {
            // Dragging left
            currentTranslateX = deltaX
        }
    }
}

const handleTouchEnd = () => {
    if (!isDragging) {
        return
    }

    isDragging = false

    if (swipeDirection === 'horizontal') {
        const flickVelocity = -0.3 // px/ms
        // If swiped more than a 33% of the way, or flicked, close the sidebar
        if (velocity < flickVelocity || currentTranslateX < -sidebarWidth / 3) {
            closeSidebar()
        }

        // Reset translation. The element will animate to its final state (open or closed)
        // because the transition class is re-applied.
        currentTranslateX = 0
    }

    swipeDirection = null
    velocity = 0
}
</script>

<svelte:window onkeydown={handleKeydown} />

<div
    class="relative z-50 lg:hidden {isOpen ? 'pointer-events-auto' : 'pointer-events-none'}"
    role="dialog"
    aria-modal="true"
    aria-labelledby="sidebar-label"
>
    <div
        class="bg-neutral/80 fixed inset-0 transition-opacity duration-300 ease-linear {isOpen
            ? 'opacity-100'
            : 'opacity-0'}"
        aria-hidden="true"
    ></div>

    <div
        class="fixed inset-0 z-10 flex w-full cursor-default"
        onclick={handleBackgroundInteraction}
        role="presentation"
        aria-label="Sidebar"
    >
        <div
            bind:this={sidebarPanel}
            class="touch-action-pan-y relative mr-16 flex w-full max-w-xs flex-1 transform {isOpen
                ? 'translate-x-0'
                : '-translate-x-full'} {isDragging
                ? ''
                : 'transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]'}"
            style={isDragging ? `transform: translateX(${currentTranslateX}px)` : ''}
            ontouchstart={handleTouchStart}
            ontouchmove={handleTouchMove}
            ontouchend={handleTouchEnd}
            use:intersectionObserver={{ rootMargin: '0px', threshold: 0.5 }}
            oninview_enter={preloadSidebar}
        >
            <div
                class="absolute top-0 left-full flex w-16 justify-center pt-5 transition duration-300 ease-in-out {isOpen
                    ? 'opacity-100'
                    : 'opacity-0'}"
            >
                <button
                    type="button"
                    class="z-20 -m-2.5 p-2.5"
                    onclick={closeSidebar}
                    aria-label="Close sidebar"
                >
                    <span class="sr-only">Close sidebar</span>
                    <svg
                        class="text-base-content size-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                        ></path>
                    </svg>
                </button>
            </div>

            <!-- Sidebar component, swap this element with another sidebar if you like -->
            <div
                class="bg-base-100 flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-2"
                id="sidebar-label"
            >
                <a href={resolve('/')} onclick={closeSidebar}>
                    <div class="flex h-16 shrink-0 items-center justify-between">
                        <img
                            class="h-8 w-auto"
                            src="https://storage.norbedo.com/storage/uploads/app-app/assets/mark.svg"
                            alt="Norbedo"
                            loading="lazy"
                        />
                    </div>
                </a>
                <nav class="flex flex-1 flex-col">
                    <ul role="list" class="flex flex-1 flex-col gap-y-7">
                        <li>
                            <ul role="list" class="-mx-2 space-y-1">
                                <li>
                                    <a
                                        href={resolve('/')}
                                        class="group bg-primary text-primary-content flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                                        onclick={closeSidebar}
                                    >
                                        <svg
                                            class="text-primary-content size-6 shrink-0"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                            data-slot="icon"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                                            ></path>
                                        </svg>
                                        Home
                                    </a>
                                </li>
                                <!-- <li>
                                    <a
                                        href="#top"
                                        class="group text-base-content/70 hover:bg-base-300 hover:text-base-content flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                                        onclick={closeSidebar}
                                    >
                                        <svg
                                            class="text-base-content/50 group-hover:text-primary size-6 shrink-0"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                            data-slot="icon"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                                            ></path>
                                        </svg>
                                        Team
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#top"
                                        class="group text-base-content/70 hover:bg-base-300 hover:text-base-content flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                                        onclick={closeSidebar}
                                    >
                                        <svg
                                            class="text-base-content/50 group-hover:text-primary size-6 shrink-0"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                            data-slot="icon"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                                            ></path>
                                        </svg>
                                        Projects
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#top"
                                        class="group text-base-content/70 hover:bg-base-300 hover:text-base-content flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                                        onclick={closeSidebar}
                                    >
                                        <svg
                                            class="text-base-content/50 group-hover:text-primary size-6 shrink-0"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                            data-slot="icon"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                                            ></path>
                                        </svg>
                                        Calendar
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#top"
                                        class="group text-base-content/70 hover:bg-base-300 hover:text-base-content flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                                        onclick={closeSidebar}
                                    >
                                        <svg
                                            class="text-base-content/50 group-hover:text-primary size-6 shrink-0"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                            data-slot="icon"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                                            ></path>
                                        </svg>
                                        Documents
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#top"
                                        class="group text-base-content/70 hover:bg-base-300 hover:text-base-content flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                                        onclick={closeSidebar}
                                    >
                                        <svg
                                            class="text-base-content/50 group-hover:text-primary size-6 shrink-0"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                            data-slot="icon"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
                                            ></path>
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
                                            ></path>
                                        </svg>
                                        Reports
                                    </a>
                                </li> -->
                            </ul>
                        </li>
                        <li>
                            <div class="text-base-content/50 text-xs/6 font-semibold">Actions</div>
                            <ul role="list" class="-mx-2 mt-2 space-y-1">
                                <!-- <li>
                                    <a
                                        href="#top"
                                        class="group text-base-content/70 hover:bg-base-300 hover:text-base-content flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                                        onclick={closeSidebar}
                                    >
                                        <span
                                            class="border-base-300 bg-base-100 text-base-content/50 group-hover:border-primary group-hover:text-primary flex size-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium"
                                        >
                                            H
                                        </span>
                                        <span class="truncate">Heroicons</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#top"
                                        class="group text-base-content/70 hover:bg-base-300 hover:text-base-content flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                                        onclick={closeSidebar}
                                    >
                                        <span
                                            class="border-base-300 bg-base-100 text-base-content/50 group-hover:border-primary group-hover:text-primary flex size-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium"
                                        >
                                            T
                                        </span>
                                        <span class="truncate">Tailwind Labs</span>
                                    </a>
                                </li> -->
                                <li>
                                    <a
                                        href={resolve('/auth/signin')}
                                        class="group text-base-content/70 hover:bg-base-300 hover:text-base-content flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                                        onclick={closeSidebar}
                                    >
                                        <span
                                            class="border-base-300 bg-base-100 text-base-content/50 group-hover:border-primary group-hover:text-primary flex size-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium"
                                        >
                                            S
                                        </span>
                                        <span class="truncate">Sign in</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <!-- <li class="-mx-6 mt-auto">
                            <a
                                href="#top"
                                class="text-base-content hover:bg-base-300 flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold"
                                onclick={closeSidebar}
                            >
                                <img
                                    class="bg-base-200 size-8 rounded-full"
                                    src="https://storage.norbedo.com/storage/uploads/app-app/assets/tom.jpg"
                                    alt="Some Dude"
                                />
                                <span class="sr-only">Your profile</span>
                                <span aria-hidden="true">Tom Cook</span>
                            </a>
                        </li> -->
                    </ul>
                </nav>
            </div>
        </div>
    </div>
</div>

<!-- Static sidebar for desktop -->
<div
    class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col"
    use:intersectionObserver={{ rootMargin: '0px', threshold: 0.5 }}
    oninview_enter={preloadSidebar}
>
    <!-- Sidebar component, swap this element with another sidebar if you like -->
    <div
        class="border-base-300 bg-base-100 flex grow flex-col gap-y-5 overflow-y-auto border-r px-6"
    >
        <a href={resolve('/')}>
            <div class="flex h-16 shrink-0 items-center">
                <img
                    class="h-8 w-auto"
                    src="https://storage.norbedo.com/storage/uploads/app-app/assets/mark.svg"
                    alt="Norbedo"
                    loading="lazy"
                />
            </div>
        </a>
        <nav class="flex flex-1 flex-col">
            <ul role="list" class="flex flex-1 flex-col gap-y-7">
                <li>
                    <ul role="list" class="-mx-2 space-y-1">
                        <li>
                            <!-- Current: "bg-primary text-primary-content", Default: "text-base-content/70 hover:bg-base-300 hover:text-base-content" -->
                            <a
                                href={resolve('/')}
                                class="group bg-primary text-primary-content flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                            >
                                <svg
                                    class="text-primary-content size-6 shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                    data-slot="icon"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                                    ></path>
                                </svg>
                                Home
                            </a>
                        </li>
                        <!-- <li>
                            <a
                                href="#top"
                                class="group text-base-content/70 hover:bg-base-300 hover:text-base-content flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                            >
                                <svg
                                    class="text-base-content/50 group-hover:text-primary size-6 shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                    data-slot="icon"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                                    ></path>
                                </svg>
                                Team
                            </a>
                        </li>
                        <li>
                            <a
                                href="#top"
                                class="group text-base-content/70 hover:bg-base-300 hover:text-base-content flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                            >
                                <svg
                                    class="text-base-content/50 group-hover:text-primary size-6 shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                    data-slot="icon"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                                    ></path>
                                </svg>
                                Projects
                            </a>
                        </li>
                        <li>
                            <a
                                href="#top"
                                class="group text-base-content/70 hover:bg-base-300 hover:text-base-content flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                            >
                                <svg
                                    class="text-base-content/50 group-hover:text-primary size-6 shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                    data-slot="icon"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                                    ></path>
                                </svg>
                                Calendar
                            </a>
                        </li>
                        <li>
                            <a
                                href="#top"
                                class="group text-base-content/70 hover:bg-base-300 hover:text-base-content flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                            >
                                <svg
                                    class="text-base-content/50 group-hover:text-primary size-6 shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                    data-slot="icon"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                                    ></path>
                                </svg>
                                Documents
                            </a>
                        </li>
                        <li>
                            <a
                                href="#top"
                                class="group text-base-content/70 hover:bg-base-300 hover:text-base-content flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                            >
                                <svg
                                    class="text-base-content/50 group-hover:text-primary size-6 shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                    data-slot="icon"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
                                    ></path>
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
                                    ></path>
                                </svg>
                                Reports
                            </a>
                        </li> -->
                    </ul>
                </li>
                <li>
                    <div class="text-base-content/50 text-xs/6 font-semibold">Actions</div>
                    <ul role="list" class="-mx-2 mt-2 space-y-1">
                        <!-- <li>
                            <a
                                href="#top"
                                class="group text-base-content/70 hover:bg-base-300 hover:text-base-content flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                            >
                                <span
                                    class="border-base-300 bg-base-100 text-base-content/50 group-hover:border-primary group-hover:text-primary flex size-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium"
                                >
                                    H
                                </span>
                                <span class="truncate">Heroicons</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="#top"
                                class="group text-base-content/70 hover:bg-base-300 hover:text-base-content flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                            >
                                <span
                                    class="border-base-300 bg-base-100 text-base-content/50 group-hover:border-primary group-hover:text-primary flex size-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium"
                                >
                                    T
                                </span>
                                <span class="truncate">Tailwind Labs</span>
                            </a>
                        </li> -->
                        <li>
                            <a
                                href={resolve('/auth/signin')}
                                class="group text-base-content/70 hover:bg-base-300 hover:text-base-content flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                            >
                                <span
                                    class="border-base-300 bg-base-100 text-base-content/50 group-hover:border-primary group-hover:text-primary flex size-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium"
                                >
                                    S
                                </span>
                                <span class="truncate">Sign in</span>
                            </a>
                        </li>
                    </ul>
                </li>
                <li class="-mx-6 mt-auto">
                    <a
                        href={resolve('/account')}
                        class="text-base-content hover:bg-base-300 flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold"
                    >
                        <img
                            class="bg-base-200 size-8 rounded-full"
                            src="https://storage.norbedo.com/storage/uploads/app-app/assets/tom.jpg"
                            alt="Some Dude"
                        />
                        <span class="sr-only">Your profile</span>
                        <span aria-hidden="true">Tom Cook</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</div>

<div
    class="bg-base-100 sticky top-0 z-40 flex items-center gap-x-6 px-4 py-4 shadow-xs sm:px-6 lg:hidden"
>
    <button
        type="button"
        class="text-base-content/70 -m-2.5 p-2.5 lg:hidden"
        onclick={openSidebar}
        aria-label="Open sidebar"
    >
        <span class="sr-only">Open sidebar</span>
        <svg
            class="size-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            aria-hidden="true"
            data-slot="icon"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            ></path>
        </svg>
    </button>
    <div class="text-base-content flex-1 text-sm/6 font-semibold"></div>
    <a href={resolve('/account')}>
        <span class="sr-only">Profile</span>
        <img
            class="bg-base-200 size-8 rounded-full"
            src="https://storage.norbedo.com/storage/uploads/app-app/assets/tom.jpg"
            alt="Tom"
        />
    </a>
</div>
