import {
    COOKIE_NAME_LEGACY,
    SESSION_COOKIE,
    createUserAppwriteClient,
    getSession
} from '$lib/server/appwrite.js'
import { redirect } from '@sveltejs/kit'

export async function load(event) {
    const session = getSession(event)

    if (!session) {
        redirect(302, '/auth/signin?redirectTo=/account')
    }

    const { account } = createUserAppwriteClient(event)

    return {
        user: account.get().catch(() => {})
    }
}

// Define our log out endpoint/server action.
export const actions = {
    default: async (event) => {
        // Create the Appwrite client.
        const { account } = createUserAppwriteClient(event)

        // Delete the session on Appwrite, and delete the session cookie.
        await account.deleteSession('current')
        event.cookies.delete(SESSION_COOKIE, { path: '/' })
        event.cookies.delete(COOKIE_NAME_LEGACY, { path: '/' })

        // Redirect to the sign up page.
        redirect(302, '/auth/signup')
    }
}
