import { vValidator } from '@hono/valibot-validator'
import { Hono } from 'hono/tiny'
import { boolean, type InferOutput, minLength, object, pick, pipe, string, uuid } from 'valibot'
import { authentication } from './authentication'

export const Task = object({
    done: boolean(),
    id: pipe(string(), uuid()),
    name: pipe(string(), minLength(1, 'Name is required'))
})

export type Task = InferOutput<typeof Task>

export const TaskCreateInput = pick(Task, ['name'])
export type TaskCreateInput = InferOutput<typeof TaskCreateInput>

export const TaskParam = pick(Task, ['id'])
export type TaskParam = InferOutput<typeof TaskParam>

/**
 * This will be our in-memory data store
 */
let tasks: Task[] = []

export const router = new Hono()
    .get('/tasks', (c) => {
        return c.json<Task[]>(tasks)
    })
    .post('/tasks', vValidator('json', TaskCreateInput), (c) => {
        const t0 = performance.now()
        const body = c.req.valid('json')
        const task = {
            done: false,
            id: crypto.randomUUID(),
            name: body.name
        }
        tasks = [...tasks, task]
        const t1 = performance.now()

        return c.json({
            ...task,
            time: `Time: ${t1 - t0}`
        })
    })
    .post('/tasks/:id/finish', vValidator('param', TaskParam), (c) => {
        const { id } = c.req.valid('param')
        const task = tasks.find((task) => task.id === id)
        if (task) {
            task.done = true
            return c.json(task)
        }

        throw c.json({ message: 'Task not found' }, 404)
    })
    .post('/tasks/:id/undo', vValidator('param', TaskParam), (c) => {
        const { id } = c.req.valid('param')
        const task = tasks.find((task) => task.id === id)
        if (task) {
            task.done = false
            return c.json(task)
        }

        throw c.json({ message: 'Task not found' }, 404)
    })
    .post('/tasks/:id/delete', vValidator('param', TaskParam), (c) => {
        const { id } = c.req.valid('param')
        tasks = tasks.filter((task) => task.id !== id)
        return c.json({ message: 'Task deleted' })
    })
    .route('/auth', authentication)

export type Router = typeof router

export const api = new Hono()
    .basePath('/api')
    .get('/health', () => {
        return new Response('OK', { status: 200 })
    })
    .route('/', router)
