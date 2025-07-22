import { createUserAppwriteClient } from '$lib/server/appwrite'
import type { Handle } from '@sveltejs/kit'

const timeoutPromise = (ms: number) => new Promise<null>((res) => setTimeout(res, ms))

export const handle: Handle = async ({ event, resolve }) => {
    // try {
    //     const { account } = createUserAppwriteClient(event)

    //     const user = await Promise.race([timeoutPromise(200), account.get()])

    //     if (user) {
    //         event.locals.user = user
    //     }
    // } catch (error) {
    //     console.error(error)
    //     event.locals.user = null
    // }

    return resolve(event)
}
