/* eslint-disable max-len */

'use client'

import { FilePond } from 'react-filepond'
import { useEffect, useState } from 'react'

import 'filepond/dist/filepond.min.css'
import { FilePondFile, FilePondInitialFile } from 'filepond'
import { UploadFileInfo } from '../interfaces/UploadFileInfo'
import { ResponseFile } from '../interfaces/ResponseFile'

export const UploadTransFile = () => {
  const [files, setFiles] = useState<Array<FilePondInitialFile | File | Blob>>([])
  const [uploadFilesInfo, setUploadFilesInfo] = useState<UploadFileInfo[]>([])
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  const handleUpdateFiles = (fileItems: FilePondFile[]) => {
    const updatedFiles: Array<FilePondInitialFile | File | Blob> = fileItems.map(
      fileItem => fileItem.file
    )
    setFiles(updatedFiles)
  }

  const handleFileProcessed = (response: ResponseFile) => {
    console.log('response', response)
    if (response.ok && response.data) {
      setUploadFilesInfo(prevState => [response.data as UploadFileInfo, ...prevState])
      return 'success'
    }
    return 'failure'
  }

  // console.log('files', files)

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
          maxFiles={5}
          onupdatefiles={handleUpdateFiles}
          credits={false}
          labelIdle='Drag & Drop your CSV files or <span class="filepond--label-action"> Browse </span>'
          server={{
            process: {
              url: '/api/transactions/upload',
              method: 'POST',
              withCredentials: false,
              onload: handleFileProcessed,
              onerror: response => {
                console.error('Error al subir el archivo:', response)
              },
              ondata: formData => {
                console.log('formData', formData)
                return formData
              }
            }
          }}
        />
      </div>
    </>
  )
}
