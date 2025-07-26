import { Hono } from 'hono/tiny'
import { authentication } from './authentication'
import { tasks } from './tasks'

export const router = new Hono()
    .get('/health', () => {
        return new Response('OK', { status: 200 })
    })
    .route('/tasks', tasks)
    .route('/auth', authentication)

export type Router = typeof router

export const api = new Hono().basePath('/api').route('/', router)
