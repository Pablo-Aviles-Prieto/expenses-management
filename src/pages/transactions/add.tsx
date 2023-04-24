import { FieldText, FormBtn, FormContainer, CalendarField, SwitchBtn } from '@/components/Form'
import { formikBtnIsDisabled } from '@/utils'
import { Formik, FormikHelpers } from 'formik'
import { useState } from 'react'
import { AddSchema } from '@/validations/transactions'

import 'react-datepicker/dist/react-datepicker.css'

const INITIAL_VALUES = {
  name: '',
  amount: '',
  datePickerAdd: ''
}

type FormValues = typeof INITIAL_VALUES

const AddTransaction = () => {
  const [isSavingTransaction, setIsSavingTransaction] = useState(false)

  const handleSubmit = (values: FormValues, helpers: FormikHelpers<FormValues>) => {
    setIsSavingTransaction(true)
    console.log('values =>', values)
    // TODO: Remove leading zeroes from the amount input (pareInt?)
    setIsSavingTransaction(false)
    helpers.setSubmitting(false)
  }

  // TODO: Create 2 btns, one to create the transaction and redirect to the user dashboard
  // and create other btn so the user can create the transaction and after saving it, keep in
  // the same form with the data stored, so it can modify and create a new one
  return (
    <Formik initialValues={INITIAL_VALUES} validationSchema={AddSchema} onSubmit={handleSubmit}>
      {({ isSubmitting, errors }) => (
        <FormContainer title="Add transaction" containerWidth="full">
          <FieldText id="name" name="name" type="text" placeholder="Describe your transaction" label="Name" />
          <FieldText id="amount" name="amount" type="number" placeholder="0.00" step="0.01" label="Amount" />
          <CalendarField
            id="datePickerAdd"
            name="datePickerAdd"
            label="Pick a date"
            customClass="add-calendar-input"
            isClearable
          />
          <SwitchBtn label="Recurrent transaction" customClasses="my-6" size="small" />
          <SwitchBtn label="Recurrent transaction" customClasses="my-6" size="medium" bgColor="cyan" />
          <SwitchBtn label="Recurrent transaction" customClasses="my-6" size="large" labelPosition="left" />
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
