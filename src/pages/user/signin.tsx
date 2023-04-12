/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-void */
/* eslint-disable max-len */
import { FC, useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import { FieldText } from '@/components/Form'
import { LoginSchema } from '@/validations/auth'
import { formikBtnIsDisabled } from '@/utils'
import { signIn } from 'next-auth/react'
import { useCustomSession } from '@/hooks/useCustomSession'
import { useRouter } from 'next/router'
import { Spinner } from '@/components/styles'
import { GoogleSVG } from '@/components/icons'
import { useToast } from '@/hooks'
import { toast } from 'react-toastify'

const INITIAL_VALUES = {
  email: '',
  password: ''
}

type FormValues = typeof INITIAL_VALUES

type IProvider = 'google'

const Signin: FC = () => {
  const { data: session, status: statusSession } = useCustomSession()
  const [signInLoading, setSignInLoading] = useState(false)
  const [credentialsError, setCredentialsError] = useState<string | boolean>(false)
  const router = useRouter()
  const { showToast, promiseToast } = useToast()

  useEffect(() => {
    if (session?.user) {
      void router.push(`/user/${session.user.id}/details`)
    }
  }, [session])

  const handleSubmit = async (values: FormValues) => {
    setSignInLoading(true)

    await promiseToast({
      promiseFn: signIn('user-pw', {
        email: values.email,
        password: values.password,
        redirect: false
      }),
      onPending: 'Signing in...',
      onSuccess: {
        render: response => {
          if (response.data?.ok) {
            setCredentialsError(false)
            // TODO: Should make a setTimeout so whenever the user successfully logs in
            // it waits until the session has the ID data to make the redirect
            return 'Signed in succesfully'
          }
          if (response.data?.error === 'CredentialsSignin') {
            toast.error('Please, check the credentials provided')
            setCredentialsError('Incorrect credentials')
            return
            // setCredentialsError('Incorrect credentials')
            // return 'Please, check the credentials provided'
          }
          setCredentialsError('Incorrect credentials')
          return 'Sign-in failed. Please try again later!'
        }
      },
      onError: {
        render: error => {
          // Not using setCredentialsError since its a form error state
          console.log('Error during sign-in:', error)
          return `Unexpected error during sign-in. Please try again later`
        }
      }
    })

    setSignInLoading(false)
  }

  // const handleSubmit = async (values: FormValues) => {
  //   try {
  //     setSignInLoading(true)
  //     const response = await signIn('user-pw', {
  //       email: values.email,
  //       password: values.password,
  //       redirect: false
  //     })
  //     if (response?.ok) {
  //       // The sign-in was successful.
  //       // TODO: Should make a setTimeout so whenever the user succesfully logs in
  //       // it waits until the session has the ID data to make the redirect
  //       showToast({ msg: 'Welcome back' })
  //       console.log('Sign-in successful:', response)
  //       setCredentialsError(false)
  //     } else {
  //       // The sign-in failed.
  //       console.log('Sign-in failed:', response)
  //       setCredentialsError('Check the credentials provided')
  //     }
  //     setSignInLoading(false)
  //   } catch (error) {
  //     // TODO: Handle toast (not using setCredentialsError since is a form warning)
  //     setSignInLoading(false)
  //     console.log('Error during sign-in:', error)
  //   }
  // }

  const handleProviderAuth = async (provider: IProvider) => {
    await signIn(provider)
  }

  if (statusSession === 'authenticated') {
    return <h1 className="text-5xl">Loading user data...</h1>
  }

  return (
    <Formik initialValues={INITIAL_VALUES} validationSchema={LoginSchema} onSubmit={handleSubmit}>
      {({ isSubmitting, errors }) => (
        <div className="w-full max-w-sm">
          <Form className="px-8 pt-6 pb-8 mb-4 bg-indigo-700 rounded shadow-md">
            <h3 className="mb-2 text-3xl font-bold">Login</h3>
            {typeof credentialsError === 'string' && <p className="mb-2 text-red-500">{credentialsError}</p>}
            <FieldText id="email" name="email" type="email" placeholder="user@example.com" label="Email" />
            <FieldText id="password" name="password" type="password" placeholder="********" label="Password" />

            <div className="flex items-center justify-between">
              <button
                className={`flex items-center gap-3 px-4 py-2 font-bold text-blue-900 hover:text-blue-300 
								rounded focus:outline-none focus:shadow-outline ${
                  formikBtnIsDisabled({ isSubmitting, errorsObj: errors })
                    ? 'bg-gray-500'
                    : 'bg-blue-300 hover:bg-blue-700'
                }`}
                type="submit"
                disabled={formikBtnIsDisabled({
                  isSubmitting,
                  errorsObj: errors
                })}
              >
                {signInLoading && <Spinner size="xs" classes="border-violet-400 w-6 h-6" />}
                Login
              </button>
              <button
                type="button"
                onClick={() => handleProviderAuth('google')}
                className={`flex items-center gap-2 px-2 py-2 font-bold text-blue-900 hover:text-blue-300 
								rounded focus:outline-none focus:shadow-outline ${isSubmitting ? 'bg-gray-500' : 'bg-blue-300 hover:bg-blue-700'}`}
                disabled={isSubmitting}
              >
                <GoogleSVG width={18} height={18} />
                Login w/ Google
              </button>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  )
}

export default Signin
