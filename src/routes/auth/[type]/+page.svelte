<script lang="ts">
    import { enhance } from '$app/forms'
    import { page } from '$app/state'

    const isSigninPage = $derived(page.params.type === 'signin')

    let { form } = $props()
    let loading = $state(false)
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
                use:enhance={() => {
                    loading = true
                    return async ({ update }) => {
                        await update()
                        loading = false
                    }
                }}
            >
                <div>
                    <label
                        for="email"
                        class={[
                            'block text-sm/6 font-medium',
                            form?.errors?.email ? 'text-red-400' : 'text-white'
                        ]}
                    >
                        Email address
                    </label>
                    <div class="mt-2">
                        <input
                            id="email"
                            type="email"
                            value={form?.email ?? ''}
                            name="email"
                            required
                            autocomplete="email"
                            aria-errormessage={form?.errors?.email?.message}
                            aria-invalid={form?.errors?.email ? 'true' : 'false'}
                            class={[
                                'block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6',
                                form?.errors?.email &&
                                    'border-2 border-red-400 outline-red-400 focus:outline-red-400'
                            ]}
                        />
                        {#if form?.errors?.email}
                            <p class="mt-2 text-sm text-red-400">
                                {form.errors.email.message}
                            </p>
                        {/if}
                    </div>
                </div>

                <div>
                    <div class="flex items-center justify-between">
                        <label
                            for="password"
                            class={[
                                'block text-sm/6 font-medium',
                                form?.errors?.password ? 'text-red-400' : 'text-white'
                            ]}
                        >
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
                            value={form?.password ?? ''}
                            name="password"
                            required
                            autocomplete="current-password"
                            aria-errormessage={form?.errors?.password?.message}
                            aria-invalid={form?.errors?.password ? 'true' : 'false'}
                            class={[
                                'block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6',
                                form?.errors?.password &&
                                    'border-2 border-red-400 outline-red-400 focus:outline-red-400'
                            ]}
                        />
                        {#if form?.errors?.password}
                            <p class="mt-2 text-sm text-red-400">
                                {form.errors.password.message}
                            </p>
                        {/if}
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
