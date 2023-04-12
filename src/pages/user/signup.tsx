/* eslint-disable max-len */
import { FC, useState } from 'react'
import { Formik, Form } from 'formik'
import { DebouncedFieldText, FieldText } from '@/components/Form'
import { SignupSchema, PasswordSchema } from '@/validations/auth'
import { useFetch } from '@/hooks/useFetch'
import { formikBtnIsDisabled } from '@/utils'
import { ResponseUserI } from '@/interfaces'
import { URL_API } from '@/utils/const'
import { Spinner } from '@/components/styles'
import { signIn } from 'next-auth/react'
import router from 'next/router'

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

  const handleSubmit = async (values: FormValues) => {
    // TODO: Signin the user after register with user/pw
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
      } else {
        setRegisterError('Something went wrong. Try again later!')
      }
    } catch (err) {
      const errorString = err instanceof Error ? err.message : 'Try again later'
      const errorMessage = errorString.includes('Email already in use') && 'Email already registered'
      setRegisterError(errorMessage || errorString)
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
              <button
                className={`flex items-center gap-3 px-4 py-2 font-bold text-white rounded focus:outline-none focus:shadow-outline ${
                  formikBtnIsDisabled({ isSubmitting, errorsObj: errors, debouncedPasswordError: debouncedPwrdError })
                    ? 'bg-gray-500'
                    : 'bg-blue-500 hover:bg-blue-700'
                }`}
                type="submit"
                disabled={formikBtnIsDisabled({
                  isSubmitting,
                  errorsObj: errors,
                  debouncedPasswordError: debouncedPwrdError
                })}
              >
                {registerLoading && <Spinner size="xs" classes="border-violet-400 w-6 h-6" />}
                Register
              </button>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  )
}

export default SignUp
