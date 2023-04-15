/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-void */
/* eslint-disable max-len */
import { FC, useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import { FieldText } from '@/components/Form'
import { LoginSchema } from '@/validations/auth'
import { formikBtnIsDisabled } from '@/utils'
import { getSession, signIn } from 'next-auth/react'
import { useCustomSession } from '@/hooks/useCustomSession'
import { useRouter } from 'next/router'
import { Spinner } from '@/components/styles'
import { GoogleSVG } from '@/components/icons'
import { useToast } from '@/hooks'
import { CustomSessionI } from '@/interfaces'

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
  const { showLoadingToast, updateToast } = useToast()

  useEffect(() => {
    if (session?.user) {
      void router.push(`/user/${session.user.id}/details`)
    }
  }, [session])

  const handleSubmit = async (values: FormValues) => {
    const signInToast = showLoadingToast({ msg: 'Signing in...' })
    setSignInLoading(true)
    try {
      const response = await signIn('user-pw', {
        email: values.email,
        password: values.password,
        redirect: false
      })
      if (response?.ok) {
        const updatedSession = (await getSession()) as CustomSessionI | null
        if (updatedSession?.user) {
          await router.push(`/user/${updatedSession.user.id}/details`)
          updateToast({
            toastId: signInToast,
            content: 'Signed in successfully',
            type: 'success',
            otherOpts: { autoClose: 1500 }
          })
          setCredentialsError(false)
          setSignInLoading(false)
        }
      } else {
        updateToast({
          toastId: signInToast,
          content: 'Please, check your credentials',
          type: 'error',
          otherOpts: { autoClose: 1500 }
        })
        setCredentialsError('Check the credentials provided')
      }
      setSignInLoading(false)
    } catch (error) {
      updateToast({
        toastId: signInToast,
        content: 'There was an error. Please try again later',
        type: 'error'
      })
      setSignInLoading(false)
      console.log('Error during sign-in:', error)
    }
  }

  const handleProviderAuth = (provider: IProvider) => {
    void signIn(provider, { redirect: false })
  }

  // TODO: set spinner
  // This only happens when a logged user visit this page or redirected by Oauth
  if (statusSession === 'authenticated' && !signInLoading) {
    return <h1 className="text-5xl">Loading personal page..</h1>
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
								rounded focus:outline-none focus:shadow-outline ${
                  isSubmitting || signInLoading ? 'bg-gray-500' : 'bg-blue-300 hover:bg-blue-700'
                }`}
                disabled={isSubmitting || signInLoading}
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
