import { Hono } from 'hono/tiny'
import { authentication } from './authentication.ts'

export const router = new Hono()
    .get('/health', () => {
        return new Response('OK', { status: 200 })
    })
    .get('/healthz', () => {
        return new Response('OK', { status: 200 })
    })
    .route('/auth', authentication)

export type Router = typeof router

export const api = new Hono().basePath('/api').route('/', router)
