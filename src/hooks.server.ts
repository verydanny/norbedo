import { createUserAppwriteClient } from '$lib/server/appwrite'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
    try {
        const { account } = createUserAppwriteClient(event)

        event.locals.user = await account.get()
    } catch {
        event.locals.user = null
    }

    return resolve(event)
}
