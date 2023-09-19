/* eslint-disable max-len */
import {
  FieldText,
  FormBtn,
  FormContainer,
  CalendarField,
  SwitchBtn,
  ComboboxField
} from '@/components/Form'
import { Formik, FormikHelpers } from 'formik'
import { FC, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { formikBtnIsDisabled } from '@/utils/formikBtnDisabled'
import { AddSchema } from '@/validations/transactions'
import { URL_API, dateFormat, errorMessages } from '@/utils/const'
import { CoinsStack } from '@/components/icons'
import { NextPageContext } from 'next'
import type { CategoryI, TransactionObjI, ResponseTransactionI } from '@/interfaces'

import 'react-datepicker/dist/react-datepicker.css'
import { useFetch } from '@/hooks/useFetch'
import { useCustomSession } from '@/hooks/useCustomSession'

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

type PropsI = {
  userCategories: ResponseI
}

type ResponseI = {
  result: CategoryI[] | string
}

const URL_FETCH_CAT = `${URL_API || ''}/api/categories/all`
const URL_POST_TRANSACTION = `${URL_API || ''}/api/transactions/add`

export async function getServerSideProps(context: NextPageContext) {
  const cookies = context.req?.headers.cookie || ''

  const res: Response = await fetch(URL_FETCH_CAT, {
    headers: {
      cookie: cookies
    }
  })
  const data = (await res.json()) as ResponseI

  return {
    props: {
      userCategories: data
    }
  }
}

// TODO: Add the currency selected by the user in the global context, in the amount input
// maybe indicate to the user that is displaying the global currency selected
const AddTransaction: FC<PropsI> = ({ userCategories }) => {
  const [isSavingTransaction, setIsSavingTransaction] = useState(false)
  const [additionalDates, setAdditionalDates] = useState<(Date | null)[]>([])
  const [addTransactionError, setAddTransactionError] = useState<string | undefined>(undefined)
  const { fetchPetition } = useFetch()
  const { data } = useCustomSession()

  // TODO: pass the categories to the combobox and finish the logic on backend to create
  // the new categories with correct id
  // TODO: Check if send the fake id created in the front to the backend or no, atm im sending
  // the id, the name and the newEntry props. (probably send it and handle in the back?)
  const handleSubmit = async (values: FormValues, helpers: FormikHelpers<FormValues>) => {
    setIsSavingTransaction(true)

    const dates = Array.from({ length: 5 }, (_, index) => {
      const keyValue = `additionalDate_${index + 1}` as AdditionalDateKeys
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

    const transactionsToSave = [newTransaction, ...additionalNewTransactions]
    console.log('transactionsToSave', transactionsToSave)

    try {
      const extraHeaders = {
        Authorization: `Bearer ${data?.accessToken || ''}`
      }
      const addTransaction = await fetchPetition<ResponseTransactionI>(
        URL_POST_TRANSACTION,
        {
          method: 'POST',
          body: JSON.stringify({ transactions: transactionsToSave })
        },
        extraHeaders
      )
      console.log('addTransaction', addTransaction)
    } catch (err) {
      const errorString = err instanceof Error ? err.message : errorMessages.generic
      setAddTransactionError(errorString)
    } finally {
      setIsSavingTransaction(false)
      helpers.setSubmitting(false)
    }

    // TODO: Use a toast
    // TODO: Send the userId prop ??
    // Send an array to the backend endpoint and save every obj in it
  }

  const handleAdditionalDateChange = (date: Date | null, index: number) => {
    if (index === 5) return
    setAdditionalDates(prevState => {
      const newAdditionalDates = [...prevState]
      newAdditionalDates[index] = date
      return newAdditionalDates
    })
  }

  const categoriesArray = useMemo(
    () => (Array.isArray(userCategories.result) ? userCategories.result : []),
    [userCategories]
  )

  // TODO: Create 2 btns, one to create the transaction and redirect to the user dashboard
  // and create other btn so the user can create the transaction and after saving it, keep in
  // the same form with the data stored, so it can modify and create a new one
  // TODO: Use the fetch error => addTransactionError
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
          <FieldText
            id="amount"
            name="amount"
            type="number"
            placeholder="0.00"
            step="0.01"
            label="Amount"
            isRequired
          />
          <ComboboxField
            id="categories"
            name="categories"
            label="Categories"
            dataArray={[...categoriesArray]}
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
          <SwitchBtn
            name="recurrent"
            label="Recurrent transaction (up to 5 more different dates)"
            size="small"
          />
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
