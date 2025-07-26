import { type ActionFailure, fail, redirect } from '@sveltejs/kit'
import { safeParse } from 'valibot'
import { makeClient } from '$lib/api/make-client.ts'
import { EmailPasswordSchema } from '$lib/schemas/authentication.ts'
import { getSession } from '$lib/server/appwrite.ts'
import type { PageServerLoadEvent, RequestEvent } from './$types.d.ts'

type ErrorResponse = Record<'email' | 'password', { message: string }>

export const load = (event: PageServerLoadEvent): void => {
    const session = getSession(event)

    if (session) {
        redirect(302, '/account')
    }
}

export const actions = {
    signin: async ({
        request,
        fetch
    }: RequestEvent): Promise<
        | ActionFailure<{
              error: true
              errors: Partial<ErrorResponse>
          }>
        | undefined
    > => {
        const client = makeClient(fetch)
        const result = safeParse(EmailPasswordSchema, Object.fromEntries(await request.formData()))

        if (!result.success) {
            const errors = result.issues.reduce((acc, error) => {
                const key = error?.path?.[0].key as string
                const message = error?.message

                if (key && !acc[key as keyof ErrorResponse]) {
                    acc[key as keyof ErrorResponse] = { message }
                }

                return acc
            }, {} as ErrorResponse)

            return fail(400, { error: true, errors })
        }

        const sessionResponse = await client.auth.signin.$post({
            json: {
                email: result.output.email,
                password: result.output.password
            }
        })

        if (sessionResponse.ok) {
            return redirect(302, '/account')
        }

        return fail(400, {
            error: true,
            errors: {
                email: { message: 'Invalid email' },
                password: { message: 'Invalid password' }
            }
        })
    },
    signup: async ({
        request,
        fetch
    }: RequestEvent): Promise<
        | ActionFailure<{
              error: true
              errors: Partial<ErrorResponse>
          }>
        | undefined
    > => {
        const client = makeClient(fetch)
        const result = safeParse(EmailPasswordSchema, Object.fromEntries(await request.formData()))

        if (!result.success) {
            const errors = result.issues.reduce((acc, error) => {
                const key = error?.path?.[0].key as string
                const message = error?.message

                if (key && !acc[key as keyof ErrorResponse]) {
                    acc[key as keyof ErrorResponse] = { message }
                }

                return acc
            }, {} as ErrorResponse)

            return fail(400, {
                error: true,
                errors
            })
        }

        const sessionResponse = await client.auth.signup.$post({
            json: {
                email: result.output.email,
                password: result.output.password
            }
        })

        if (sessionResponse.ok) {
            return redirect(302, '/account')
        }

        return fail(400, {
            error: true,
            errors: {
                email: { message: 'Invalid email' },
                password: { message: 'Invalid password' }
            }
        })
    }
}
