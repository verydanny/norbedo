import type { RequestHandler } from '@sveltejs/kit'
import { api } from '$lib/api/main'

export const GET: RequestHandler = ({ request }) => api.fetch(request)
export const POST: RequestHandler = ({ request }) => api.fetch(request)
export const PUT: RequestHandler = ({ request }) => api.fetch(request)
export const DELETE: RequestHandler = ({ request }) => api.fetch(request)
export const PATCH: RequestHandler = ({ request }) => api.fetch(request)
export const OPTIONS: RequestHandler = ({ request }) => api.fetch(request)
export const HEAD: RequestHandler = ({ request }) => api.fetch(request)
