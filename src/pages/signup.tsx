/* eslint-disable max-len */
import React, { useState } from 'react'
import { Formik, Form, FormikHelpers, FormikErrors } from 'formik'
import { DebouncedFieldText, FieldText } from '@/components/Form'
import { SignupSchema, PasswordSchema } from '@/validations/auth'

const INITIAL_VALUES = {
  name: '',
  email: '',
  password: ''
}

type FormValues = typeof INITIAL_VALUES

type btnDisabledI = {
  isSubmitting: boolean
  errorsObj: FormikErrors<FormValues>
  debouncedPasswordError?: string
}

const SignIn = () => {
  const [debouncedPwrdError, setDebouncedPwrdError] = useState<string | undefined>(undefined)

  const handleSubmit = (values: FormValues, actions: FormikHelpers<FormValues>) => {
    console.log('Form data', values)
    // Handle form submission, e.g. call your signUp function
    actions.resetForm()
  }

  const bntIsDisabled = ({ isSubmitting, errorsObj, debouncedPasswordError }: btnDisabledI) => {
    return isSubmitting || Object.keys(errorsObj).length > 0 || !!debouncedPasswordError
  }

  return (
    <Formik initialValues={INITIAL_VALUES} validationSchema={SignupSchema} onSubmit={handleSubmit}>
      {({ isSubmitting, errors }) => (
        <div className="w-full max-w-xs">
          <Form className="px-8 pt-6 pb-8 mb-4 bg-indigo-700 rounded shadow-md">
            <FieldText id="name" name="name" type="text" placeholder="Username" label="Name" />
            <FieldText id="email" name="email" type="email" placeholder="user@example.com" label="Email" />
            <DebouncedFieldText
              id="password"
              name="password"
              type="password"
              placeholder="********"
              label="Password"
              errorMsg={debouncedPwrdError}
              setErrorMsg={setDebouncedPwrdError}
              validationSchema={PasswordSchema}
            />
            <div className="flex items-center justify-between">
              <button
                className={`px-4 py-2 font-bold text-white rounded focus:outline-none focus:shadow-outline ${
                  bntIsDisabled({ isSubmitting, errorsObj: errors, debouncedPasswordError: debouncedPwrdError })
                    ? 'bg-gray-500'
                    : 'bg-blue-500 hover:bg-blue-700'
                }`}
                type="submit"
                disabled={bntIsDisabled({
                  isSubmitting,
                  errorsObj: errors,
                  debouncedPasswordError: debouncedPwrdError
                })}
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
