import { SESSION_COOKIE_PREFIX } from '$env/static/private'
import { PUBLIC_APPWRITE_PROJECT_ID } from '$env/static/public'

export const COOKIE_NAME = SESSION_COOKIE_PREFIX + PUBLIC_APPWRITE_PROJECT_ID
export const COOKIE_NAME_LEGACY = COOKIE_NAME + '_legacy'
