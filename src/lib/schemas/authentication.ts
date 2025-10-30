import { email, minLength, nonEmpty, object, pipe, string, trim } from 'valibot'

export const EmailSchema = pipe(
    string('Huh? What is this?'),
    nonEmpty('Ey, you need to enter your email address.'),
    trim(),
    email('Hmmmm, are you sure this is a valid email address?')
)

export const SignupPasswordSchema = pipe(
    string('Please enter your password.'),
    minLength(8, 'Nah.'),
    trim()
)

export const SigninPasswordSchema = pipe(string('Please enter your password.'), trim())

export const SignupEmailPasswordSchema = object({
    email: EmailSchema,
    password: SignupPasswordSchema
})

export const SigninEmailPasswordSchema = object({
    email: EmailSchema,
    password: SigninPasswordSchema
})
