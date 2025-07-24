import type { Cookies, RequestEvent } from '@sveltejs/kit'
import { Account, Client, type Models, Users } from 'node-appwrite'
import { APPWRITE_API_KEY, SESSION_COOKIE_PREFIX } from '$env/static/private'
import { PUBLIC_APPWRITE_API_ENDPOINT, PUBLIC_APPWRITE_PROJECT_ID } from '$env/static/public'

export const COOKIE_NAME = `${SESSION_COOKIE_PREFIX}${PUBLIC_APPWRITE_PROJECT_ID}`
export const COOKIE_NAME_LEGACY = `${COOKIE_NAME}_legacy`

export const setSessionCookies = (cookies: Cookies, session: Models.Session) =>
    [COOKIE_NAME, COOKIE_NAME_LEGACY].forEach((cookieName) =>
        cookies.set(cookieName, session.secret, {
            expires: new Date(session.expire),
            httpOnly: true,
            path: '/',
            sameSite: 'strict',
            secure: true
        })
    )

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

export const getSession = ({ cookies }: RequestEvent) => {
    return cookies.get(COOKIE_NAME) || cookies.get(COOKIE_NAME_LEGACY)
}

export function createUserAppwriteClient(event: RequestEvent) {
    const client = new Client()
        .setEndpoint(PUBLIC_APPWRITE_API_ENDPOINT)
        .setProject(PUBLIC_APPWRITE_PROJECT_ID)

    const session = getSession(event)
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
