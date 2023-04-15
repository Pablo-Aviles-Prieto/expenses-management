/* eslint-disable max-len */
import { FC, useState } from 'react'
import { Formik, Form } from 'formik'
import { DebouncedFieldText, FieldText } from '@/components/Form'
import { SignupSchema, PasswordSchema } from '@/validations/auth'
import { useFetch } from '@/hooks/useFetch'
import { formikBtnIsDisabled } from '@/utils'
import { ResponseUserI } from '@/interfaces'
import { URL_API } from '@/utils/const'
import { FormBtn } from '@/components/styles'
import { signIn } from 'next-auth/react'
import router from 'next/router'
import { useCustomToast } from '@/hooks'

const URL = `${URL_API || ''}/api/user/register`

const INITIAL_VALUES = {
  name: '',
  email: '',
  password: ''
}

type FormValues = typeof INITIAL_VALUES

const SignUp: FC = () => {
  const [debouncedPwrdError, setDebouncedPwrdError] = useState<string | undefined>(undefined)
  const [registerError, setRegisterError] = useState<string | undefined>(undefined)
  const [registerLoading, setRegisterLoading] = useState(false)
  const { fetchPetition } = useFetch()
  const { showLoadingToast, updateToast } = useCustomToast()

  const handleSubmit = async (values: FormValues) => {
    const registeringToast = showLoadingToast({ msg: 'Registering...' })
    setRegisterLoading(true)
    try {
      const registerResponse = await fetchPetition<ResponseUserI>(URL, {
        method: 'POST',
        body: JSON.stringify(values)
      })
      const loginResponse = await signIn('user-pw', {
        email: values.email,
        password: values.password,
        redirect: false
      })
      if (loginResponse?.ok) {
        await router.push(`/user/${registerResponse.id}/details`)
        updateToast({
          toastId: registeringToast,
          content: `Welcome ${registerResponse.name}`,
          type: 'success'
        })
      } else {
        setRegisterError('Something went wrong. Try again later!')
        updateToast({
          toastId: registeringToast,
          content: 'Something went wrong. Try again later!',
          type: 'error',
          otherOpts: { autoClose: 3000 }
        })
      }
    } catch (err) {
      const errorString = err instanceof Error ? err.message : 'Try again later'
      const errorMessage = errorString.includes('Email already in use') && 'Email already registered'
      setRegisterError(errorMessage || errorString)
      updateToast({
        toastId: registeringToast,
        content: errorMessage || errorString,
        type: 'error',
        otherOpts: { autoClose: 3000 }
      })
    } finally {
      setRegisterLoading(false)
    }
  }

  return (
    <Formik initialValues={INITIAL_VALUES} validationSchema={SignupSchema} onSubmit={handleSubmit}>
      {({ isSubmitting, errors }) => (
        <div className="w-full max-w-sm">
          <Form className="px-8 pt-6 pb-8 mb-4 bg-indigo-700 rounded shadow-md">
            <h3 className="mb-2 text-2xl font-bold">Register an account</h3>
            {registerError && <p className="mb-2 text-red-500">{registerError}</p>}
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
              <FormBtn
                isDisabled={formikBtnIsDisabled({
                  isSubmitting,
                  errorsObj: errors,
                  debouncedPasswordError: debouncedPwrdError
                })}
                isLoading={registerLoading}
              >
                Register
              </FormBtn>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  )
}

export default SignUp
