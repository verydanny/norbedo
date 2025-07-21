import { Client, Account, Users, type Models } from 'node-appwrite'
import { PUBLIC_APPWRITE_API_ENDPOINT, PUBLIC_APPWRITE_PROJECT_ID } from '$env/static/public'
import { APPWRITE_API_KEY, SESSION_COOKIE_PREFIX } from '$env/static/private'
import type { Cookies, RequestEvent } from '@sveltejs/kit'
import { COOKIE_NAME } from '$lib/api/authentication'

export const SESSION_COOKIE = SESSION_COOKIE_PREFIX + PUBLIC_APPWRITE_PROJECT_ID
export const COOKIE_NAME_LEGACY = SESSION_COOKIE + '_legacy'

export const setSessionCookies = (cookies: Cookies, session: Models.Session) => {
    ;[COOKIE_NAME, COOKIE_NAME_LEGACY].forEach((cookieName) =>
        cookies.set(cookieName, session.secret, {
            httpOnly: true,
            sameSite: 'strict',
            expires: new Date(session.expire),
            secure: true,
            path: '/'
        })
    )
}

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

    const session = event.cookies.get(SESSION_COOKIE || COOKIE_NAME_LEGACY)
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
