import { vValidator } from '@hono/valibot-validator'
import { Hono } from 'hono/tiny'
import { type Task, TaskCreateInput, TaskParam } from '$lib/schemas/tasks'

/**
 * This will be our in-memory data store
 */
let taskStorage: Task[] = []

export const tasks = new Hono()
    .get('/', (c) => {
        return c.json<Task[]>(taskStorage)
    })
    .post('/', vValidator('json', TaskCreateInput), (c) => {
        const t0 = performance.now()
        const body = c.req.valid('json')
        const task = {
            done: false,
            id: crypto.randomUUID(),
            name: body.name
        }
        taskStorage = [...taskStorage, task]
        const t1 = performance.now()

        return c.json({
            ...task,
            time: `Time: ${t1 - t0}`
        })
    })
    .post('/:id/finish', vValidator('param', TaskParam), (c) => {
        const { id } = c.req.valid('param')
        const task = taskStorage.find((task) => task.id === id)
        if (task) {
            task.done = true
            return c.json(task)
        }

        throw c.json({ message: 'Task not found' }, 404)
    })
    .post('/:id/undo', vValidator('param', TaskParam), (c) => {
        const { id } = c.req.valid('param')
        const task = taskStorage.find((task) => task.id === id)
        if (task) {
            task.done = false
            return c.json(task)
        }

        throw c.json({ message: 'Task not found' }, 404)
    })
    .post('/:id/delete', vValidator('param', TaskParam), (c) => {
        const { id } = c.req.valid('param')
        taskStorage = taskStorage.filter((task) => task.id !== id)
        return c.json({ message: 'Task deleted' })
    })
