import { Hono } from 'hono/tiny'
import { setCookie } from 'hono/cookie'
import { zValidator } from '@hono/zod-validator'
import { SESSION_COOKIE_PREFIX } from '$env/static/private'
import { PUBLIC_APPWRITE_PROJECT_ID } from '$env/static/public'
import { z } from 'zod'
import { createAdminAppwriteClient } from '$lib/server/appwrite'
import { ID } from 'node-appwrite'

export const COOKIE_NAME = SESSION_COOKIE_PREFIX + PUBLIC_APPWRITE_PROJECT_ID
export const COOKIE_NAME_LEGACY = COOKIE_NAME + '_legacy'

const emailPasswordSchema = z.object({
    email: z.email(),
    password: z.string().min(8)
})

export const authentication = new Hono()
    .post('/signup', zValidator('json', emailPasswordSchema), async (c) => {
        const body = c.req.valid('json')

        const { account } = createAdminAppwriteClient()

        try {
            await account.create(ID.unique(), body.email, body.password)
            const session = await account.createEmailPasswordSession(body.email, body.password)

            setCookie(c, COOKIE_NAME, session.secret, {
                sameSite: 'strict',
                expires: new Date(session.expire),
                secure: true,
                path: '/',
                httpOnly: true
            })
            setCookie(c, COOKIE_NAME_LEGACY, session.secret, {
                sameSite: 'strict',
                expires: new Date(session.expire),
                secure: true,
                path: '/',
                httpOnly: true
            })

            return c.json(
                {
                    success: true
                },
                200
            )
        } catch (error) {
            return c.json(
                {
                    error: 'Invalid email or password'
                },
                401
            )
        }
    })
    .post('/signin', zValidator('json', emailPasswordSchema), async (c) => {
        const body = c.req.valid('json')

        const { account } = createAdminAppwriteClient()

        try {
            const session = await account.createEmailPasswordSession(body.email, body.password)

            setCookie(c, COOKIE_NAME, session.secret, {
                sameSite: 'strict',
                expires: new Date(session.expire),
                secure: true,
                path: '/',
                httpOnly: true
            })
            setCookie(c, COOKIE_NAME_LEGACY, session.secret, {
                sameSite: 'strict',
                expires: new Date(session.expire),
                secure: true,
                path: '/',
                httpOnly: true
            })

            return c.json(
                {
                    success: true
                },
                200
            )
        } catch (error) {
            console.error(error)

            return c.json(
                {
                    error: 'Invalid email or password'
                },
                401
            )
        }
    })
