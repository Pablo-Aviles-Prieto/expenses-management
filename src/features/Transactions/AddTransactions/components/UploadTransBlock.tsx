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
import { CategoryI, TransactionObjI } from '@/interfaces'
import { Form, Formik, FormikHelpers } from 'formik'
import { FormBtn } from '@/components/Form'
import { ResponseFile } from '../interfaces/ResponseFile'
import { TransactionBulk } from '../interfaces/TransactionBulk'
import { BulkTransTable } from './BulkTransTable'

import 'filepond/dist/filepond.min.css'

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

export const UploadTransBlock: FC<Props> = ({ categoriesArray, setIsManualTransExpanded }) => {
  const [files, setFiles] = useState<Array<FilePondInitialFile | File | Blob>>([])
  const [bulkTransactions, setBulkTransactions] = useState<TransactionBulk[]>([])
  const [isReady, setIsReady] = useState(false)
  const [isSavingTransaction, setIsSavingTransaction] = useState(false)
  const { showToast } = useCustomToast()

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

  const onSubmit = (
    values: typeof initialFormValues,
    helpers: FormikHelpers<typeof initialFormValues>
  ) => {
    setIsSavingTransaction(true)
    // TODO: IMPORTANT HAVE TO KNOW HOW THE DATE FORMAT IS IN THE CSV, so
    // the date is parsable to a backend format yyyy-mm-dd
    const transactions: TransactionObjI[] = bulkTransactions.map((trans, i) => {
      const categories =
        values[`categories_${i}`]?.dataValues?.length > 0
          ? values[`categories_${i}`].dataValues
          : [{ id: 99, name: 'Generic', newEntry: true }]
      return {
        name: trans.Concept,
        amount: parseFloat(trans.Amount),
        date: trans.Date,
        categories,
        notes: trans.Notes
      }
    })
    console.log('values', values)
    console.log('transactions', transactions)
    // TODO: Make a petition to the backend
    setIsSavingTransaction(false)
    helpers.setSubmitting(false)
    // TODO: Redirect to the transactions page
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
            <BulkTransTable bulkTransactions={bulkTransactions} categoriesArray={categoriesArray} />
            <div className="mt-2 text-center">
              <FormBtn isDisabled={false}>Upload the transactions</FormBtn>
            </div>
          </Form>
        </Formik>
      )}
    </>
  )
}
