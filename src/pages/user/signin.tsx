/* eslint-disable no-void */
/* eslint-disable max-len */
import { FC, useEffect } from 'react'
import { Formik, Form, FormikHelpers } from 'formik'
import { FieldText } from '@/components/Form'
import { LoginSchema } from '@/validations/auth'
import { formikBtnIsDisabled } from '@/utils'
import { signIn } from 'next-auth/react'
import { useCustomSession } from '@/hooks/useCustomSession'
import { useRouter } from 'next/router'

const INITIAL_VALUES = {
  email: '',
  password: ''
}

type FormValues = typeof INITIAL_VALUES

const Signin: FC = () => {
  const { data: session, status } = useCustomSession()
  const router = useRouter()
  console.log('session', session)
  console.log('status', status)

  useEffect(() => {
    if (session?.user) {
      void router.push(`/user/${session.user.id}/details`)
    }
  }, [session])

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    try {
      const response = await signIn('user-pw', {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: 'http://localhost:3000'
      })
      if (response?.ok) {
        // The sign-in was successful.
        // You can handle the response object as needed, e.g., update the UI, redirect the user, etc.
        console.log('Sign-in successful:', response)
      } else {
        // The sign-in failed.
        console.log('Sign-in failed:', response)
      }
    } catch (error) {
      console.log('Error during sign-in:', error)
    }
  }

  return (
    <Formik initialValues={INITIAL_VALUES} validationSchema={LoginSchema} onSubmit={handleSubmit}>
      {({ isSubmitting, errors }) => (
        <div className="w-full max-w-xs">
          <Form className="px-8 pt-6 pb-8 mb-4 bg-indigo-700 rounded shadow-md">
            <FieldText id="email" name="email" type="email" placeholder="user@example.com" label="Email" />
            <FieldText id="password" name="password" type="password" placeholder="********" label="Password" />

            <div className="flex items-center justify-between">
              <button
                className={`px-4 py-2 font-bold text-white rounded focus:outline-none focus:shadow-outline ${
                  formikBtnIsDisabled({ isSubmitting, errorsObj: errors })
                    ? 'bg-gray-500'
                    : 'bg-blue-500 hover:bg-blue-700'
                }`}
                type="submit"
                disabled={formikBtnIsDisabled({
                  isSubmitting,
                  errorsObj: errors
                })}
              >
                Log in
              </button>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  )
}

export default Signin
