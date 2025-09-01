import { redirect } from '@sveltejs/kit'
import type { Models } from 'node-appwrite'
import {
    COOKIE_NAME,
    COOKIE_NAME_LEGACY,
    createUserAppwriteClient,
    getSession
} from '$lib/server/appwrite'
import type { PageServerLoadEvent, RequestEvent } from './$types'

export async function load(event: PageServerLoadEvent): Promise<{
    user: Promise<Models.User<Models.Preferences> | null>
}> {
    const session = getSession(event)

    if (!session) {
        redirect(302, '/auth/signin?redirectTo=/account')
    }

    const { account } = createUserAppwriteClient(event)

    return {
        user: account.get().catch(() => null)
    }
}

// Define our log out endpoint/server action.
export const actions = {
    default: async (event: RequestEvent): Promise<void> => {
        // Create the Appwrite client.
        const { account } = createUserAppwriteClient(event)

        // Delete the session on Appwrite, and delete the session cookie.
        await account.deleteSession('current')
        event.cookies.delete(COOKIE_NAME, { path: '/' })
        event.cookies.delete(COOKIE_NAME_LEGACY, { path: '/' })

        // Redirect to the sign up page.
        redirect(302, '/auth/signup')
    }
}
