/* eslint-disable max-len */
import { FC, useState } from 'react'
import { Formik, Form } from 'formik'
import { DebouncedFieldText, FieldText } from '@/components/Form'
import { SignupSchema, PasswordSchema } from '@/validations/auth'
import { useQuery } from '@/hooks/useQuery'
import { formikBtnIsDisabled } from '@/utils'
import { ResponseUserI } from '@/interfaces'
import { URL_API } from '@/utils/const'
import { Spinner } from '@/components/styles'

const URL = `${URL_API || ''}/api/user/register`

const INITIAL_VALUES = {
  name: '',
  email: '',
  password: ''
}

type FormValues = typeof INITIAL_VALUES

const SignUp: FC = () => {
  const [debouncedPwrdError, setDebouncedPwrdError] = useState<string | undefined>(undefined)
  const {
    data,
    error,
    loading,
    refetch: saveNewUser
  } = useQuery<ResponseUserI>({
    url: URL,
    fetchOnMount: false,
    useToken: false
  })
  console.log('data', data)
  // console.log('loading', loading)
  console.log('error response', error)

  const handleSubmit = async (values: FormValues) => {
    // TODO: Signin the user after register with user/pw
    await saveNewUser({
      method: 'POST',
      body: JSON.stringify(values)
    })
  }

  return (
    <Formik initialValues={INITIAL_VALUES} validationSchema={SignupSchema} onSubmit={handleSubmit}>
      {({ isSubmitting, errors }) => (
        <div className="w-full max-w-sm">
          <Form className="px-8 pt-6 pb-8 mb-4 bg-indigo-700 rounded shadow-md">
            <h3 className="mb-2 text-2xl font-bold">Register an account</h3>
            {error?.message && error.message.includes('Email already in use') && (
              <p className="mb-2 text-red-500">Email already registered</p>
            )}
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
                {loading && <Spinner size="xs" classes="border-violet-400 w-6 h-6" />}
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
