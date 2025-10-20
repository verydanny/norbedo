import { performance } from 'node:perf_hooks'
import type { Handle } from '@sveltejs/kit'
import { createUserAppwriteClient } from '$lib/server/appwrite'

export const handle: Handle = async ({ event, resolve }) => {
    const timer = performance.now()
    try {
        const { account } = createUserAppwriteClient(event)

        event.locals.user = await account.get()
    } catch {}

    console.log(`Time taken: ${performance.now() - timer}ms`)

    return resolve(event)
}
