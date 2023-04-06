/* eslint-disable max-len */
import React from 'react'
import { Formik, Form, FormikHelpers, FormikErrors } from 'formik'
import * as Yup from 'yup'
import { FieldText } from '@/components/Form'

const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required')
})

const INITIAL_VALUES = {
  name: '',
  email: '',
  password: ''
}

type btnDisabledI = {
  isSubmitting: boolean
  errorsObj: FormikErrors<typeof INITIAL_VALUES>
}

type FormValues = typeof INITIAL_VALUES

const SignIn = () => {
  const handleSubmit = (values: FormValues, actions: FormikHelpers<FormValues>) => {
    console.log('Form data', values)
    // Handle form submission, e.g. call your signUp function
    actions.resetForm()
  }

  const bntIsDisabled = ({ isSubmitting, errorsObj }: btnDisabledI) => {
    return isSubmitting || Object.keys(errorsObj).length > 0
  }

  return (
    <Formik initialValues={INITIAL_VALUES} validationSchema={SignupSchema} onSubmit={handleSubmit}>
      {({ isSubmitting, errors }) => (
        <div className="w-full max-w-xs">
          <Form className="px-8 pt-6 pb-8 mb-4 bg-indigo-700 rounded shadow-md">
            <FieldText id="name" name="name" type="text" placeholder="Username" label="Name" />
            <FieldText id="email" name="email" type="email" placeholder="user@example.com" label="Email" />
            <FieldText id="password" name="password" type="password" placeholder="********" label="Password" />
            <div className="flex items-center justify-between">
              <button
                className={`px-4 py-2 font-bold text-white rounded focus:outline-none focus:shadow-outline ${
                  bntIsDisabled({ isSubmitting, errorsObj: errors }) ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700'
                }`}
                type="submit"
                disabled={bntIsDisabled({ isSubmitting, errorsObj: errors })}
              >
                Register
              </button>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  )
}

export default SignIn
