import { FieldText, FormBtn, FormContainer, CalendarField, SwitchBtn } from '@/components/Form'
import { formikBtnIsDisabled } from '@/utils'
import { Formik, FormikHelpers } from 'formik'
import { useState } from 'react'
import { AddSchema } from '@/validations/transactions'

import 'react-datepicker/dist/react-datepicker.css'
import { format } from 'date-fns'
import { dateFormat } from '@/utils/const'

const INITIAL_VALUES = {
  name: '',
  amount: '',
  datePickerAdd: '',
  recurrent: false,
  additionalDate_1: '',
  additionalDate_2: '',
  additionalDate_3: '',
  additionalDate_4: '',
  additionalDate_5: ''
}

type FormValues = typeof INITIAL_VALUES

type AdditionalDateKeys =
  | 'additionalDate_1'
  | 'additionalDate_2'
  | 'additionalDate_3'
  | 'additionalDate_4'
  | 'additionalDate_5'

type TransactionObjI = {
  name: string
  amount: number
  datePickerAdd: string
}

const AddTransaction = () => {
  const [isSavingTransaction, setIsSavingTransaction] = useState(false)
  const [additionalDates, setAdditionalDates] = useState<(Date | null)[]>([])

  const handleSubmit = (values: FormValues, helpers: FormikHelpers<FormValues>) => {
    setIsSavingTransaction(true)

    const dates = Array.from({ length: 5 }, (_, index) => {
      const keyValue: AdditionalDateKeys = `additionalDate_${index + 1}` as AdditionalDateKeys
      return values[keyValue]
    })

    const additionalDatesParsed = dates.filter(date => date)

    let formattedAdditionalDates: string[] = []

    if (additionalDatesParsed.length > 0) {
      formattedAdditionalDates = additionalDatesParsed.map(parsedDate => format(new Date(parsedDate), dateFormat.ISO))
    }

    const newTransaction: TransactionObjI = {
      name: values.name,
      amount: parseFloat(values.amount),
      datePickerAdd: format(new Date(values.datePickerAdd), dateFormat.ISO)
    }

    let additionalNewTransactions: TransactionObjI[] = []

    if (formattedAdditionalDates.length > 0) {
      additionalNewTransactions = formattedAdditionalDates.map(additionalDate => {
        return {
          name: values.name,
          amount: parseFloat(values.amount),
          datePickerAdd: format(new Date(additionalDate), dateFormat.ISO)
        }
      })
    }

    // TODO: Add the notes textarea in the form and in the object to save
    // Send the array to the backend endpoint and save every obj in it (at least 1 will be in the array)
    const transactionsToSave = [newTransaction, ...additionalNewTransactions]
    console.log('transactionsToSave', transactionsToSave)

    setIsSavingTransaction(false)
    helpers.setSubmitting(false)
  }

  const handleAdditionalDateChange = (date: Date | null, index: number) => {
    if (index === 5) return
    setAdditionalDates(prevState => {
      const newAdditionalDates = [...prevState]
      newAdditionalDates[index] = date
      return newAdditionalDates
    })
  }

  // TODO: Create 2 btns, one to create the transaction and redirect to the user dashboard
  // and create other btn so the user can create the transaction and after saving it, keep in
  // the same form with the data stored, so it can modify and create a new one
  return (
    <Formik initialValues={INITIAL_VALUES} validationSchema={AddSchema} onSubmit={handleSubmit}>
      {({ isSubmitting, errors, values }) => (
        <FormContainer title="Add transaction" containerWidth="full">
          <FieldText id="name" name="name" type="text" placeholder="Describe your transaction" label="Name" />
          <FieldText id="amount" name="amount" type="number" placeholder="0.00" step="0.01" label="Amount" />
          <CalendarField
            id="datePickerAdd"
            name="datePickerAdd"
            label="Pick a date"
            customClass="add-calendar-input"
            isClearable
            onChange={date => handleAdditionalDateChange(date, 0)}
          />
          <SwitchBtn name="recurrent" label="Recurrent transaction (up to 5 more different dates)" size="small" />
          {values.recurrent &&
            additionalDates.map((_, index) => (
              <CalendarField
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                id={`additionalDate_${index + 1}`}
                name={`additionalDate_${index + 1}`}
                label={`Additional Date ${index + 1}`}
                customClass="add-calendar-input"
                onChange={date => handleAdditionalDateChange(date, index + 1)}
                isClearable
                removeErrMsg
              />
            ))}
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
