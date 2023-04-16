import { FieldText, FormContainer } from '@/components/Form'
import { useDateFormat } from '@/hooks/useDateFormat'
import { LoginSchema } from '@/validations/auth'
import { Formik } from 'formik'
import { useState } from 'react'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'

const INITIAL_VALUES = {
  email: '',
  password: ''
}

type FormValues = typeof INITIAL_VALUES

const AddTransaction = () => {
  const [dateRange, setDateRange] = useState<Array<Date | null>>([new Date(), new Date()])
  const [startDate, endDate] = dateRange
  const { dateFormatSelected } = useDateFormat()

  console.log('dateFormatSelected', dateFormatSelected)

  const handleSubmit = (values: FormValues) => {
    console.log('values =>', values)
  }

  return (
    <Formik initialValues={INITIAL_VALUES} validationSchema={LoginSchema} onSubmit={handleSubmit}>
      {({ isSubmitting, errors }) => (
        <FormContainer title="Add transaction" containerWidth="full">
          <FieldText id="email" name="email" type="email" placeholder="user@example.com" label="Email" />
          <FieldText id="password" name="password" type="password" placeholder="********" label="Password" />
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={update => {
              setDateRange(update)
            }}
            dateFormat={dateFormatSelected}
            placeholderText="Pick a date"
            isClearable
          />
        </FormContainer>
      )}
    </Formik>
  )
}

export default AddTransaction
