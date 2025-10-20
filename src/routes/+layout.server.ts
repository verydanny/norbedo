import type { LayoutServerLoadEvent } from './$types.d.ts'

export const load = async (event: LayoutServerLoadEvent) => {
    event.depends('app:user')

    return {
        user: event.locals.user
    }
}
