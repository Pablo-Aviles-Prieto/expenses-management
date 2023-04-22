import { FieldText, FormBtn, FormContainer } from '@/components/Form'
import { FormInputContainer } from '@/components/styles'
import { useDateFormat } from '@/hooks/useDateFormat'
import { formikBtnIsDisabled } from '@/utils'
import { LoginSchema } from '@/validations/auth'
import { Formik } from 'formik'
import { useState } from 'react'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'

const INITIAL_VALUES = {
  email: '',
  password: '',
  datePickerAdd: new Date().toString()
}

type FormValues = typeof INITIAL_VALUES

const AddTransaction = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [isSavingTransaction, setIsSavingTransaction] = useState(false)
  const { dateFormatSelected } = useDateFormat()

  console.log('dateFormatSelected', dateFormatSelected)
  console.log('selectedDate', selectedDate)

  const handleSubmit = (values: FormValues) => {
    setIsSavingTransaction(true)
    console.log('values =>', values)
    setIsSavingTransaction(false)
  }

  const errorClass = !selectedDate ? 'border-red-500 border-2' : ''

  // TODO: Create 2 btns, one to create the transaction and redirect to the user dashboard
  // and create other btn so the user can create the transaction and after saving it, keep in
  // the same form with the data stored, so it can modify and create a new one
  return (
    <Formik initialValues={INITIAL_VALUES} validationSchema={LoginSchema} onSubmit={handleSubmit}>
      {({ isSubmitting, errors }) => (
        <FormContainer title="Add transaction" containerWidth="full">
          <FieldText id="email" name="email" type="email" placeholder="user@example.com" label="Email" />
          <FieldText id="password" name="password" type="password" placeholder="********" label="Password" />
          {/* TODO: create a container for the date picker in the components/Form/CalendarField.tsx */}
          <FormInputContainer label="Pick a date" id="datePickerAdd">
            <DatePicker
              id="datePickerAdd"
              selected={selectedDate}
              className={`add-calendar-input ${errorClass}`}
              highlightDates={[new Date()]}
              onChange={update => {
                setSelectedDate(update)
              }}
              dateFormat={dateFormatSelected}
              placeholderText="Select or write a date"
              isClearable
            />
            <p className="min-h-[25px] text-red-500">{!selectedDate && 'You have to select a date'}</p>
          </FormInputContainer>
          <div className="flex items-center justify-between">
            <FormBtn
              isDisabled={formikBtnIsDisabled({
                isSubmitting,
                errorsObj: errors
              })}
              isLoading={isSavingTransaction}
            >
              Add transaction
            </FormBtn>
          </div>
        </FormContainer>
      )}
    </Formik>
  )
}

export default AddTransaction
