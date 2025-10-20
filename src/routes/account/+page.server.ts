import { redirect } from '@sveltejs/kit'
import { COOKIE_NAME, COOKIE_NAME_LEGACY, createUserAppwriteClient } from '$lib/server/appwrite'
import type { RequestEvent } from './$types'

// Define our log out endpoint/server action.
export const actions = {
    default: async (event: RequestEvent): Promise<void> => {
        // Create the Appwrite client.
        const { account } = createUserAppwriteClient(event)

        // Delete the session on Appwrite, and delete the session cookie.
        await account.deleteSession({ sessionId: 'current' })
        event.cookies.delete(COOKIE_NAME, { path: '/' })
        event.cookies.delete(COOKIE_NAME_LEGACY, { path: '/' })

        // Redirect to the sign up page.
        redirect(302, '/auth/signup')
    }
}
