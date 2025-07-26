import { boolean, type InferOutput, minLength, object, pick, pipe, string, uuid } from 'valibot'

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
