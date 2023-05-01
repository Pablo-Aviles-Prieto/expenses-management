import { FieldText, FormBtn, FormContainer, CalendarField, SwitchBtn, ComboboxField } from '@/components/Form'
import { Formik, FormikHelpers } from 'formik'
import { useState } from 'react'
import { format } from 'date-fns'
import { formikBtnIsDisabled } from '@/utils'
import { AddSchema } from '@/validations/transactions'
import { COMMON_CATEGORIES, dateFormat } from '@/utils/const'
import 'react-datepicker/dist/react-datepicker.css'
import { CoinsStack } from '@/components/icons'

const INITIAL_VALUES = {
  name: '',
  amount: '',
  mainDate: '',
  recurrent: false,
  additionalDate_1: '',
  additionalDate_2: '',
  additionalDate_3: '',
  additionalDate_4: '',
  additionalDate_5: '',
  notes: '',
  categories: { typeValue: '', dataValues: [] }
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
  date: string
  creationDate: string
  categories: { id: number; name: string }[]
  notes?: string
}

// TODO: Fetch the categories of the user via SSR
const CAT_ARRAY = [{ id: 8, name: 'House repair' }]

// TODO: Add the currency selected by the user in the global context, in the amount input
// maybe indicate to the user that is displaying the global currency selected
const AddTransaction = () => {
  const [isSavingTransaction, setIsSavingTransaction] = useState(false)
  const [additionalDates, setAdditionalDates] = useState<(Date | null)[]>([])

  const handleSubmit = (values: FormValues, helpers: FormikHelpers<FormValues>) => {
    setIsSavingTransaction(true)

    const dates = Array.from({ length: 5 }, (_, index) => {
      const keyValue: AdditionalDateKeys = `additionalDate_${index + 1}` as AdditionalDateKeys
      return values[keyValue]
    })

    const formattedMainDate = format(new Date(values.mainDate), dateFormat.ISO)

    const additionalDatesParsed = dates
      .filter(date => date && format(new Date(date), dateFormat.ISO) !== formattedMainDate)
      .map(date => format(new Date(date), dateFormat.ISO))
    const uniqueDatesSet = new Set(additionalDatesParsed)
    const notDuplicatedDates = Array.from(uniqueDatesSet)

    const newTransaction: TransactionObjI = {
      name: values.name,
      amount: parseFloat(values.amount),
      date: formattedMainDate,
      creationDate: new Date().toISOString(),
      notes: values.notes ? values.notes : undefined,
      categories: values.categories.dataValues
    }

    let additionalNewTransactions: TransactionObjI[] = []

    if (values.recurrent && notDuplicatedDates.length > 0) {
      additionalNewTransactions = notDuplicatedDates.map(additionalDate => {
        return {
          name: values.name,
          amount: parseFloat(values.amount),
          date: format(new Date(additionalDate), dateFormat.ISO),
          creationDate: new Date().toISOString(),
          notes: values.notes ? values.notes : undefined,
          categories: values.categories.dataValues
        }
      })
    }

    // TODO: Use a toast
    // TODO: send the category for the transactions
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
          <FieldText
            id="name"
            name="name"
            type="text"
            placeholder="Describe your transaction"
            label="Name"
            isRequired
          />
          <FieldText id="amount" name="amount" type="number" placeholder="0.00" step="0.01" label="Amount" isRequired />
          <ComboboxField
            id="categories"
            name="categories"
            label="Categories"
            dataArray={[...COMMON_CATEGORIES, ...CAT_ARRAY]}
            msgToCreateEntry={{ SVG: CoinsStack, message: 'Create this category' }}
            subTitle="Select from the pre-defined or your saved categories, or just create a new one"
            isRequired
          />
          <CalendarField
            id="datePickerAdd"
            name="mainDate"
            label="Pick a date"
            customClass="add-calendar-input"
            isClearable
            onChange={date => handleAdditionalDateChange(date, 0)}
            isRequired
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
          <FieldText
            id="notes"
            name="notes"
            type="text"
            placeholder="Extra comments"
            label="Notes"
            component="textarea"
            rows={5}
          />
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
