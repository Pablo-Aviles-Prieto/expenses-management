import { FieldText, FormContainer } from '@/components/Form'
import { LoginSchema } from '@/validations/auth'
import { Formik } from 'formik'

const INITIAL_VALUES = {
  email: '',
  password: ''
}

type FormValues = typeof INITIAL_VALUES

const AddTransaction = () => {
  const handleSubmit = (values: FormValues) => {
    console.log('values', values)
  }

  return (
    <Formik initialValues={INITIAL_VALUES} validationSchema={LoginSchema} onSubmit={handleSubmit}>
      {({ isSubmitting, errors }) => (
        <FormContainer title="Add transaction" containerWidth="full">
          <FieldText id="email" name="email" type="email" placeholder="user@example.com" label="Email" />
          <FieldText id="password" name="password" type="password" placeholder="********" label="Password" />
        </FormContainer>
      )}
    </Formik>
  )
}

export default AddTransaction
