import * as Yup from 'yup'

export const PasswordSchema = Yup.string()
  .min(8, 'Password must be at least 8 characters')
  .required('Password is required')

const EmailSchema = Yup.string().email('Invalid email').required('Email is required')

export const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: EmailSchema,
  password: PasswordSchema
})

export const LoginSchema = Yup.object().shape({
  email: EmailSchema,
  password: PasswordSchema
})
