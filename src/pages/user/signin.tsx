/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-void */
/* eslint-disable max-len */
import { FC, useEffect, useState } from 'react'
import { Formik } from 'formik'
import { DebouncedFieldText, FieldText, FormBtn, FormContainer } from '@/components/Form'
import { LoginSchema, PasswordSchema } from '@/validations/auth'
import { formikBtnIsDisabled } from '@/utils'
import { getSession, signIn } from 'next-auth/react'
import { useCustomSession } from '@/hooks/useCustomSession'
import { useRouter } from 'next/router'
import { GoogleSVG } from '@/components/icons'
import { useCustomToast } from '@/hooks'
import { errorMessages } from '@/utils/const'
import type { CustomSessionI, IProviders } from '@/interfaces'

const INITIAL_VALUES = {
  email: '',
  password: ''
}

type FormValues = typeof INITIAL_VALUES

const Signin: FC = () => {
  const [debouncedPwrdError, setDebouncedPwrdError] = useState<string | undefined>(undefined)
  const { data: session, status: statusSession } = useCustomSession()
  const [signInLoading, setSignInLoading] = useState(false)
  const [credentialsError, setCredentialsError] = useState<string | undefined>(undefined)
  const router = useRouter()
  const { showLoadingToast, updateToast } = useCustomToast()

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
          setCredentialsError(undefined)
          setSignInLoading(false)
        }
      } else {
        updateToast({
          toastId: signInToast,
          content: errorMessages.credentials,
          type: 'error',
          otherOpts: { autoClose: 1500 }
        })
        setCredentialsError(errorMessages.credentials)
      }
      setSignInLoading(false)
    } catch (error) {
      updateToast({
        toastId: signInToast,
        content: errorMessages.generic,
        type: 'error'
      })
      setSignInLoading(false)
      console.log('Error during sign-in:', error)
    }
  }

  const handleProviderAuth = (provider: IProviders) => {
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
        <FormContainer title="Login">
          {credentialsError && <p className="mb-2 text-red-500">{credentialsError}</p>}
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
            <FormBtn isLoading={signInLoading} isDisabled={formikBtnIsDisabled({ isSubmitting, errorsObj: errors })}>
              Login
            </FormBtn>
            <FormBtn
              isDisabled={isSubmitting || signInLoading}
              onClick={() => handleProviderAuth('google')}
              type="button"
            >
              {/* TODO: Use other Google SVG or change the background color */}
              <GoogleSVG width={18} height={18} />
              Login w/ Google
            </FormBtn>
          </div>
        </FormContainer>
      )}
    </Formik>
  )
}

export default Signin
