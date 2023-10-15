/* eslint-disable dot-notation */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable max-len */

'use client'

import { FilePond } from 'react-filepond'
import { FC, useEffect, useMemo, useState } from 'react'
import { FilePondFile, FilePondInitialFile } from 'filepond'
import { useCustomToast } from '@/hooks'
import { CategoryI, ResponseTransactionI, TransactionObjI } from '@/interfaces'
import { Form, Formik, FormikHelpers } from 'formik'
import { URL_API, errorMessages } from '@/utils/const'
import { useFetch } from '@/hooks/useFetch'
import { useCustomSession } from '@/hooks/useCustomSession'
import { ResponseFile } from '../interfaces/ResponseFile'
import { TransactionBulk } from '../interfaces/TransactionBulk'
import { BulkTransTable } from './BulkTransTable'

import 'filepond/dist/filepond.min.css'
import { BulkTransTableHeader } from './BulkTransTableHeader'
import { parseToBackendDate } from '../utils/parseToBackendDate'

type CatValuesI = {
  name: string
  id: number | string
  common?: boolean
  newEntry?: boolean
}

type CatFormI = { typeValue: string; dataValues: CatValuesI[] }

type Props = {
  categoriesArray: CategoryI[]
  setIsManualTransExpanded: React.Dispatch<React.SetStateAction<boolean>>
}

const URL_POST_TRANSACTION = `${URL_API || ''}/api/transactions/add/bulk`
const DATES_CSV_FORMAT_OPTIONS = [
  'dd-MM-yyyy',
  'MM-dd-yyyy',
  'yyyy-MM-dd',
  'dd/MM/yyyy',
  'MM/dd/yyyy',
  'yyyy/MM/dd'
]

export const UploadTransBlock: FC<Props> = ({ categoriesArray, setIsManualTransExpanded }) => {
  const [files, setFiles] = useState<Array<FilePondInitialFile | File | Blob>>([])
  const [bulkTransactions, setBulkTransactions] = useState<TransactionBulk[]>([])
  const [isReady, setIsReady] = useState(false)
  const [isSavingTransaction, setIsSavingTransaction] = useState(false)
  const [CSVDateFormat, setCSVDateFormat] = useState<string>(DATES_CSV_FORMAT_OPTIONS[0])
  const { showToast } = useCustomToast()
  const { fetchPetition } = useFetch()
  const { data: dataSession } = useCustomSession()

  useEffect(() => {
    setIsReady(true)
  }, [])

  const initialFormValues = useMemo(() => {
    const initialValues: { [key: string]: CatFormI } = {}

    bulkTransactions.forEach((_, i) => {
      initialValues[`categories_${i}`] = { typeValue: '', dataValues: [] }
    })

    return initialValues
  }, [bulkTransactions])

  const handleUpdateFiles = (fileItems: FilePondFile[]) => {
    const updatedFiles: Array<FilePondInitialFile | File | Blob> = fileItems.map(
      fileItem => fileItem.file
    )
    setFiles(updatedFiles)
  }

  const handleFileProcessed = (response: any) => {
    const { ok: responseOk, data }: ResponseFile = JSON.parse(response)
    if (responseOk && data) {
      setIsManualTransExpanded(false) // Close the manual transaction block
      setBulkTransactions(prevState => [...prevState, ...data])
      return 'success'
    }
    return 'failure'
  }

  const handleCSVDateFormat = (value: string | string[]) => {
    if (Array.isArray(value)) {
      return
    }
    setCSVDateFormat(value)
  }

  const onSubmit = async (
    values: typeof initialFormValues,
    helpers: FormikHelpers<typeof initialFormValues>
  ) => {
    setIsSavingTransaction(true)
    let transactions: TransactionObjI[] = []

    const resetFormState = () => {
      setIsSavingTransaction(false)
      helpers.setSubmitting(false)
    }

    try {
      transactions = bulkTransactions.map((trans, i) => {
        const categories =
          values[`categories_${i}`]?.dataValues?.length > 0
            ? values[`categories_${i}`].dataValues
            : [{ id: 99, name: 'Generic', newEntry: true }]
        return {
          name: trans.Concept,
          amount: parseFloat(trans.Amount),
          date: parseToBackendDate({ dateString: trans.Date, dateFormatFromCSV: CSVDateFormat }),
          categories,
          notes: trans.Notes
        }
      })
    } catch {
      showToast({
        msg: errorMessages.dateFormatCSV,
        options: { type: 'error' }
      })
      resetFormState()
      return
    }
    const extraHeaders = {
      Authorization: `Bearer ${dataSession?.accessToken || ''}`
    }
    const addTransaction = await fetchPetition<ResponseTransactionI>(
      URL_POST_TRANSACTION,
      {
        method: 'POST',
        body: JSON.stringify({ transactions })
      },
      extraHeaders
    )
    console.log('response', addTransaction)

    resetFormState()
    // TODO: Redirect to the transactions page!
  }

  return (
    <>
      <h3 className="mb-2 text-2xl font-bold text-gray-300">Add multiple transactions via file</h3>
      <div className="mx-auto w-[20rem] file-wrapper" style={isReady ? { opacity: 1 } : undefined}>
        <FilePond
          files={files}
          allowMultiple
          maxFiles={3}
          onupdatefiles={handleUpdateFiles}
          credits={false}
          labelIdle='Drag & Drop your CSV files or <span class="filepond--label-action"> Browse </span>'
          labelFileProcessing="Parsing"
          labelFileProcessingComplete="Parse completed"
          labelTapToUndo="Displaying results..."
          labelTapToCancel="Please wait..."
          server={{
            process: {
              url: '/api/transactions/upload',
              method: 'POST',
              withCredentials: false,
              onload: handleFileProcessed,
              // TODO: Refactor it, since if its error constructor cant be parsed with JSON
              onerror: response => {
                const parsedResponse: ResponseFile = JSON.parse(response)
                if (!parsedResponse.ok && parsedResponse.error) {
                  showToast({
                    msg: parsedResponse.error,
                    options: { type: 'error' }
                  })
                }
              }
            }
          }}
        />
      </div>
      {bulkTransactions && bulkTransactions.length > 0 && (
        <Formik initialValues={initialFormValues} onSubmit={onSubmit}>
          <Form>
            <BulkTransTableHeader
              datesCSVFormatOptions={DATES_CSV_FORMAT_OPTIONS}
              CSVDateFormat={CSVDateFormat}
              isDisabled={isSavingTransaction}
              isLoading={isSavingTransaction}
              handleCSVDateFormat={handleCSVDateFormat}
            />
            <BulkTransTable bulkTransactions={bulkTransactions} categoriesArray={categoriesArray} />
          </Form>
        </Formik>
      )}
    </>
  )
}
