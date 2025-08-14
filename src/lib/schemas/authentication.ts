import { email, minLength, nonEmpty, object, pipe, string, trim } from 'valibot'

export const EmailSchema = pipe(
    string('Huh? What is this?'),
    nonEmpty('Ey, you need to enter your email address.'),
    trim(),
    email('Hmmmm, are you sure this is a valid email address?')
)

export const PasswordSchema = pipe(
    string('Please enter your password.'),
    minLength(8, 'Password must be at least 8 characters long.'),
    trim()
)

export const EmailPasswordSchema = object({
    email: EmailSchema,
    password: PasswordSchema
})
