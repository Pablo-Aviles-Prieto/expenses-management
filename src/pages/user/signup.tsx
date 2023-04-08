/* eslint-disable max-len */
import { FC, useState } from 'react'
import { Formik, Form, FormikHelpers } from 'formik'
import { DebouncedFieldText, FieldText } from '@/components/Form'
import { SignupSchema, PasswordSchema } from '@/validations/auth'
import { useQuery } from '@/hooks/useQuery'
import { formikBtnIsDisabled } from '@/utils'
import { ResponseUserI } from '@/interfaces'
import { URL_API } from '@/utils/const'

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
  // console.log('error response', error)

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    const response = await saveNewUser({
      method: 'POST',
      body: JSON.stringify(values)
    })
    console.log('response', response)
    actions.resetForm()
  }

  if (loading) return <h1 className="text-9xl">Registering user</h1>

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
