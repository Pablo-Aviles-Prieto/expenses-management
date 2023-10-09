/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable max-len */

'use client'

import { FilePond } from 'react-filepond'
import { FC, useEffect, useState } from 'react'

import { FilePondFile, FilePondInitialFile } from 'filepond'
import { useCustomToast } from '@/hooks'
import { ResponseFile } from '../interfaces/ResponseFile'

import 'filepond/dist/filepond.min.css'
import { TransactionBulk } from '../interfaces/TransactionBulk'

type Props = {
  setIsManualTransExpanded: React.Dispatch<React.SetStateAction<boolean>>
}

export const UploadTransFile: FC<Props> = ({ setIsManualTransExpanded }) => {
  const [files, setFiles] = useState<Array<FilePondInitialFile | File | Blob>>([])
  const [parsedData, setParsedData] = useState<TransactionBulk[]>([])
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
      setParsedData(prevState => [data, ...prevState])
      return 'success'
    }
    return 'failure'
  }

  console.log('parsedData', parsedData)

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
    </>
  )
}
