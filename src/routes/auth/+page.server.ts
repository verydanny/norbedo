import { makeClient } from '$lib/api/make-client.ts'
import { fail, redirect } from '@sveltejs/kit'

export const actions = {
    signup: async ({ request, fetch }) => {
        const client = makeClient(fetch)

        // Extract the form data.
        const form = await request.formData()
        const email = form.get('email')
        const password = form.get('password')
        const name = form.get('name')

        if (!email || !password || !name) {
            return fail(400, { email, password, name, missing: true })
        }

        if (typeof email !== 'string' || typeof password !== 'string' || typeof name !== 'string') {
            return fail(400, { email, password, name, missing: true })
        }

        const sessionResponse = await client.auth.login.$post({
            json: {
                email,
                password
            }
        })

        if (sessionResponse.ok) {
            return redirect(302, '/account')
        }

        return fail(400, { email, password, name, error: 'Invalid email or password' })
    }
}
