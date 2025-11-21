import type { Handle } from '@sveltejs/kit'
import { createUserAppwriteClient } from '$lib/server/appwrite'

export const handle: Handle = async ({ event, resolve }) => {
    try {
        const { account } = createUserAppwriteClient(event)

        event.locals.user = await account.get()
    } catch {
        // do nothing
    }

    return resolve(event)
}
