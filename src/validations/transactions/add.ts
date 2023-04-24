import * as Yup from 'yup'

// export const PasswordSchema = Yup.string()
//   .min(8, 'Password must be at least 8 characters')
//   .required('Password is required')

// const EmailSchema = Yup.string().email('Invalid email').required('Email is required')

// export const SignupSchema = Yup.object().shape({
//   name: Yup.string().required('Name is required'),
//   email: EmailSchema,
//   password: PasswordSchema
// })

// export const LoginSchema = Yup.object().shape({
//   email: EmailSchema,
//   password: PasswordSchema
// })

export const AddSchema = Yup.object().shape({
  name: Yup.string().required('Provide a name for the transaction'),
  amount: Yup.number()
    .required('Provide an amount for the transaction')
    .test('non-zero', 'Provide a different amount than 0', value => value !== 0),
  datePickerAdd: Yup.string().required('Provide a date for the transaction')
})
