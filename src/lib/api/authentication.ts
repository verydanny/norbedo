import { vValidator } from '@hono/valibot-validator'
import { setCookie } from 'hono/cookie'
import { Hono } from 'hono/tiny'
import { ID } from 'node-appwrite'
import { SigninEmailPasswordSchema, SignupEmailPasswordSchema } from '$lib/schemas/authentication'
import { COOKIE_NAME, COOKIE_NAME_LEGACY, createAdminAppwriteClient } from '$lib/server/appwrite'

export const authentication = new Hono()
    .get('/me', async (c) => {
        return c.json({
            message: 'Hello World'
        })
    })
    .post('/signup', vValidator('json', SignupEmailPasswordSchema), async (c) => {
        const { account } = createAdminAppwriteClient()
        const body = c.req.valid('json')

        try {
            await account.create({
                email: body.email,
                password: body.password,
                userId: ID.unique()
            })
            const session = await account.createEmailPasswordSession({
                email: body.email,
                password: body.password
            })

            setCookie(c, COOKIE_NAME, session.secret, {
                expires: new Date(session.expire),
                httpOnly: true,
                path: '/',
                sameSite: 'strict',
                secure: true
            })
            setCookie(c, COOKIE_NAME_LEGACY, session.secret, {
                expires: new Date(session.expire),
                httpOnly: true,
                path: '/',
                sameSite: 'strict',
                secure: true
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
                    error: 'Could not create username or Password'
                },
                401
            )
        }
    })
    .post('/signin', vValidator('json', SigninEmailPasswordSchema), async (c) => {
        const { account } = createAdminAppwriteClient()
        const body = c.req.valid('json')

        try {
            const session = await account.createEmailPasswordSession({
                email: body.email,
                password: body.password
            })

            setCookie(c, COOKIE_NAME, session.secret, {
                expires: new Date(session.expire),
                httpOnly: true,
                path: '/',
                sameSite: 'strict',
                secure: true
            })
            setCookie(c, COOKIE_NAME_LEGACY, session.secret, {
                expires: new Date(session.expire),
                httpOnly: true,
                path: '/',
                sameSite: 'strict',
                secure: true
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
