import { hc } from 'hono/client'
import { browser } from '$app/environment'
import type { Router } from '$lib/api/main'

type HonoClient = ReturnType<typeof hc<Router>>
let browserClient: HonoClient

export const makeClient = (fetch: Window['fetch']): HonoClient => {
    const origin = browser ? window.location.origin : ''

    if (browser && browserClient) {
        return browserClient
    }

    const client = hc<Router>(`${origin}/api`, { fetch })

    if (browser) {
        browserClient = client
    }

    return client
}
