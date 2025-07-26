<script lang="ts">
    import { enhance } from '$app/forms'
    import { page } from '$app/state'
    // import type { ActionResult } from '@sveltejs/kit'
    // import type { ActionsFailure, ActionsSuccess, ActionsExport } from './$types.d.ts'
    // type Result = ActionResult<ActionsSuccess<ActionsExport>, ActionsFailure<ActionsExport>>
    // interface EnhanceForm {
    //     update: (options?: { reset?: boolean; invalidateAll?: boolean }) => Promise<void>
    //     result: Result
    // }

    const isSigninPage = $derived(page.params.type === 'signin')
    let { form } = $props()
    let loading = $state(false)

    $effect(() => {
        console.log('Form', form)
    })
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
            src="https://storage.norbedo.com/storage/uploads/app-app/assets/mark.svg"
            alt="Norbedo"
            class="mx-auto h-10 w-auto"
        />
        <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            {isSigninPage ? 'Sign in to your account' : 'Sign up for an account'}
        </h2>
    </div>

    {#if loading}
        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <div class="flex justify-center">
                <div
                    class="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"
                ></div>
            </div>
        </div>
    {:else}
        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form
                action={isSigninPage ? '?/signin' : '?/signup'}
                method="POST"
                class="space-y-6"
                use:enhance
            >
                <div>
                    <label for="email" class="block text-sm/6 font-medium text-white">
                        Email address
                    </label>
                    <div class="mt-2">
                        <input
                            id="email"
                            type="email"
                            name="email"
                            required
                            autocomplete="email"
                            class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                        />
                    </div>
                </div>

                <div>
                    <div class="flex items-center justify-between">
                        <label for="password" class="block text-sm/6 font-medium text-white">
                            Password
                        </label>
                        <div class="text-sm">
                            <a
                                href="#top"
                                class="font-semibold text-indigo-400 hover:text-indigo-300"
                            >
                                Forgot password?
                            </a>
                        </div>
                    </div>
                    <div class="mt-2">
                        <input
                            id="password"
                            type="password"
                            name="password"
                            required
                            autocomplete="current-password"
                            class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                        {isSigninPage ? 'Sign in' : 'Sign up'}
                    </button>
                </div>
            </form>

            <p class="mt-10 text-center text-sm/6 text-gray-400">
                {isSigninPage ? 'Not a member?' : 'Already have an account?'}
                <a
                    href={isSigninPage ? '/auth/signup' : '/auth/signin'}
                    role="button"
                    tabindex="0"
                    type="button"
                    aria-label={isSigninPage ? 'Sign up' : 'Sign in'}
                    data-sveltekit-replacestate
                    data-sveltekit-preload-data
                    class="font-semibold text-indigo-400 hover:text-indigo-300"
                >
                    {isSigninPage ? 'Sign up' : 'Sign in'}
                </a>
            </p>
        </div>
    {/if}
</div>
