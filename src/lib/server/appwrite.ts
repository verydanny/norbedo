import { Client, Account, Users } from 'node-appwrite'
import { PUBLIC_APPWRITE_API_ENDPOINT, PUBLIC_APPWRITE_PROJECT_ID } from '$env/static/public'
import { APPWRITE_API_KEY } from '$env/static/private'
import type { RequestEvent } from '@sveltejs/kit'

export const SESSION_COOKIE = 'appwrite-session'

export function createAdminAppwriteClient() {
    const client = new Client()
        .setEndpoint(PUBLIC_APPWRITE_API_ENDPOINT)
        .setProject(PUBLIC_APPWRITE_PROJECT_ID)
        .setKey(APPWRITE_API_KEY)

    return {
        get account() {
            return new Account(client)
        },
        get users() {
            return new Users(client)
        }
    }
}

export function createUserAppwriteClient(event: RequestEvent) {
    const client = new Client()
        .setEndpoint(PUBLIC_APPWRITE_API_ENDPOINT)
        .setProject(PUBLIC_APPWRITE_PROJECT_ID)

    const session = event.cookies.get(SESSION_COOKIE)
    if (!session) {
        throw new Error('No session found')
    }

    client.setSession(session)

    return {
        get account() {
            return new Account(client)
        }
    }
}
