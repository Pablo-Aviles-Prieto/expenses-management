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
import { CategoryI } from '@/interfaces'
import { ResponseFile } from '../interfaces/ResponseFile'
import { TransactionBulk } from '../interfaces/TransactionBulk'
import { BulkTransTable } from './BulkTransTable'

import 'filepond/dist/filepond.min.css'

type ResponseI = {
  ok: boolean
  userCategories?: CategoryI[] | string
  error?: string
}

type Props = {
  userResponse: ResponseI
  setIsManualTransExpanded: React.Dispatch<React.SetStateAction<boolean>>
}

export const UploadTransBlock: FC<Props> = ({ userResponse, setIsManualTransExpanded }) => {
  const [files, setFiles] = useState<Array<FilePondInitialFile | File | Blob>>([])
  const [bulkTransactions, setBulkTransactions] = useState<TransactionBulk[]>([])
  const [isReady, setIsReady] = useState(false)
  const { showToast } = useCustomToast()

  useEffect(() => {
    setIsReady(true)
  }, [])

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

  const categoriesArray = useMemo(
    () => (Array.isArray(userResponse.userCategories) ? userResponse.userCategories : []),
    [userResponse]
  )

  return (
    <>
      <h3 className="mb-2 text-3xl font-bold text-gray-300">Add multiple transactions via file</h3>
      <div
        className="mx-auto mt-[1rem] w-[20rem] file-wrapper"
        style={isReady ? { opacity: 1 } : undefined}
      >
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
        <BulkTransTable bulkTransactions={bulkTransactions} categoriesArray={categoriesArray} />
      )}
    </>
  )
}
