import {
    COOKIE_NAME_LEGACY,
    SESSION_COOKIE,
    createUserAppwriteClient
} from '$lib/server/appwrite.js'
import { redirect } from '@sveltejs/kit'

export async function load({ locals }) {
    // Logged out users can't access this page.
    if (!locals.user) redirect(302, '/auth')

    // Pass the stored user local to the page.
    return {
        user: locals.user
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
        redirect(302, '/auth')
    }
}
