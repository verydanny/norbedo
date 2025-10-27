import { tick } from 'svelte'
import type { ActionReturn } from 'svelte/action'
import type {
    Attributes,
    Event,
    LifecycleEventDetails,
    ObserverEventDetails,
    Options,
    Position,
    ScrollDirection
} from './types.ts'

const defaultOptions: Options = {
    root: null,
    rootMargin: '0px',
    threshold: 0,
    unobserveOnEnter: false
}

const createEvent = <T = ObserverEventDetails>(name: Event, detail: T): CustomEvent<T> =>
    new CustomEvent(name, { detail })

export function intersectionObserver(
    node: HTMLElement,
    options: Options = {
        root: null,
        rootMargin: '0px',
        threshold: 0,
        unobserveOnEnter: false
    }
): ActionReturn<Options, Attributes> | undefined {
    const {
        root = null,
        rootMargin = '0px',
        threshold = 0,
        unobserveOnEnter = false
    }: Options = {
        ...defaultOptions,
        ...options
    }

    let prevPos: Position = {
        x: undefined,
        y: undefined
    }

    const scrollDirection: ScrollDirection = {
        horizontal: undefined,
        vertical: undefined
    }

    if (typeof IntersectionObserver === 'undefined') {
        return
    }

    if (node) {
        const observer = new IntersectionObserver(
            (entries, _observer) => {
                entries.forEach((singleEntry) => {
                    if (prevPos?.y && prevPos.y > singleEntry.boundingClientRect.y) {
                        scrollDirection.vertical = 'up'
                    } else {
                        scrollDirection.vertical = 'down'
                    }

                    if (prevPos?.x && prevPos.x > singleEntry.boundingClientRect.x) {
                        scrollDirection.horizontal = 'left'
                    } else {
                        scrollDirection.horizontal = 'right'
                    }

                    prevPos = {
                        x: singleEntry.boundingClientRect.x,
                        y: singleEntry.boundingClientRect.y
                    }

                    const detail: ObserverEventDetails = {
                        entry: singleEntry,
                        inView: singleEntry.isIntersecting,
                        node,
                        observer: _observer,
                        scrollDirection
                    }

                    node.dispatchEvent(createEvent('inview_change', detail))
                    //@ts-expect-error only for backward compatibility
                    node.dispatchEvent(createEvent('change', detail))

                    if (singleEntry.isIntersecting) {
                        node.dispatchEvent(createEvent('inview_enter', detail))
                        //@ts-expect-error only for backward compatibility
                        node.dispatchEvent(createEvent('enter', detail))

                        if (unobserveOnEnter) {
                            _observer.unobserve(node)
                        }
                    } else {
                        node.dispatchEvent(createEvent('inview_leave', detail))
                        //@ts-expect-error only for backward compatibility
                        node.dispatchEvent(createEvent('leave', detail))
                    }
                })
            },
            {
                root,
                rootMargin,
                threshold
            }
        )

        tick().then(() => {
            node.dispatchEvent(
                createEvent<LifecycleEventDetails>('inview_init', { node, observer })
            )
            node.dispatchEvent(
                //@ts-expect-error only for backward compatibility
                createEvent<LifecycleEventDetails>('init', { node, observer })
            )
        })

        observer.observe(node)

        return {
            destroy() {
                observer.unobserve(node)
            }
        }
    }

    return
}
