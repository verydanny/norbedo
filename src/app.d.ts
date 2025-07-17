// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { Models } from 'node-appwrite'
import '../worker-configuration.d.ts'

declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            user: Models.User<Models.Preferences> | null
        }
        // interface PageData {}
        // interface PageState {}
        interface Platform {
            env?: Cloudflare.Env
        }
    }
}

export {}
