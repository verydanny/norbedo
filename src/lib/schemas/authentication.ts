import { email, minLength, nonEmpty, object, pipe, string, trim } from 'valibot'

export const EmailSchema = pipe(
    string(),
    nonEmpty('Please enter your email.'),
    trim(),
    email('The email is badly formatted.')
)

export const PasswordSchema = pipe(
    string('Please enter your password.'),
    minLength(8, 'Password must be at least 8 characters long'),
    trim()
)

export const EmailPasswordSchema = object({
    email: EmailSchema,
    password: PasswordSchema
})
