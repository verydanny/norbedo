// import { createUserAppwriteClient } from '$lib/server/appwrite'
// import type { Handle } from '@sveltejs/kit'

// export const handle: Handle = async ({ event, resolve }) => {
//     try {
//         const { account } = createUserAppwriteClient(event)

//         event.locals.user = account.get()
//     } catch {
//         console.error('Failed to create user appwrite client')
//     }

//     return resolve(event)
// }
