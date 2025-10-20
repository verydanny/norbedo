import type { LayoutServerLoadEvent } from './$types.d.ts'

export const load = async (event: LayoutServerLoadEvent) => {
    return {
        user: event.locals.user
    }
}
