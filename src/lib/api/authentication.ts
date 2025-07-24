import { vValidator } from '@hono/valibot-validator'
import { setCookie } from 'hono/cookie'
import { Hono } from 'hono/tiny'
import { ID } from 'node-appwrite'
import { email, minLength, nonEmpty, object, pipe, string, trim } from 'valibot'
import { COOKIE_NAME, COOKIE_NAME_LEGACY, createAdminAppwriteClient } from '$lib/server/appwrite'

const EmailSchema = pipe(
    string(),
    nonEmpty('Please enter your email.'),
    trim(),
    email('The email is badly formatted.')
)

const PasswordSchema = pipe(
    string('Please enter your password.'),
    minLength(8, 'Password must be at least 8 characters long'),
    trim()
)

export const emailPasswordSchema = object({
    email: EmailSchema,
    password: PasswordSchema
})

export const authentication = new Hono()
    .get('/me', async (c) => {
        return c.json({
            message: 'Hello World'
        })
    })
    .post('/signup', vValidator('json', emailPasswordSchema), async (c) => {
        const { account } = createAdminAppwriteClient()
        const body = c.req.valid('json')

        try {
            await account.create(ID.unique(), body.email, body.password)
            const session = await account.createEmailPasswordSession(body.email, body.password)

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
        } catch (_error) {
            return c.json(
                {
                    error: 'Could not create username or Password'
                },
                401
            )
        }
    })
    .post('/signin', vValidator('json', emailPasswordSchema), async (c) => {
        const { account } = createAdminAppwriteClient()
        const body = c.req.valid('json')

        try {
            const session = await account.createEmailPasswordSession(body.email, body.password)

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
