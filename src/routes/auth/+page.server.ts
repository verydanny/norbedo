import { makeClient } from '$lib/api/make-client.ts'
import { getSession } from '$lib/server/appwrite'
import { fail, redirect } from '@sveltejs/kit'

export const load = async (event) => {
    const session = getSession(event)

    if (session) {
        redirect(302, '/account')
    }

    const { searchParams } = event.url

    return {
        signin: searchParams.get('signin') !== null
    }
}

export const actions = {
    signup: async ({ request, fetch }) => {
        const client = makeClient(fetch)

        // Extract the form data.
        const form = await request.formData()
        const email = form.get('email')
        const password = form.get('password')

        if (!email || !password) {
            return fail(400, { email, password, missing: true })
        }

        if (typeof email !== 'string' || typeof password !== 'string') {
            return fail(400, { email, password, missing: true })
        }

        const sessionResponse = await client.auth.signup.$post({
            json: {
                email,
                password
            }
        })

        if (sessionResponse.ok) {
            return redirect(302, '/account')
        }

        return fail(400, { email, password, error: 'Invalid email or password' })
    },
    signin: async ({ request, fetch }) => {
        const client = makeClient(fetch)

        const form = await request.formData()
        const email = form.get('email')
        const password = form.get('password')

        if (!email || !password) {
            return fail(400, { email, password, missing: true })
        }

        if (typeof email !== 'string' || typeof password !== 'string') {
            return fail(400, { email, password, missing: true })
        }

        const sessionResponse = await client.auth.signin.$post({
            json: {
                email,
                password
            }
        })

        if (sessionResponse.ok) {
            return redirect(302, '/account')
        }

        return fail(400, { email, password, error: 'Invalid email or password' })
    }
}
