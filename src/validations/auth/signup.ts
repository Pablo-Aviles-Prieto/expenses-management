import * as Yup from 'yup'

export const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required')
})

export const PasswordSchema = Yup.string()
  .min(8, 'Password must be at least 8 characters')
  .required('Password is required')
