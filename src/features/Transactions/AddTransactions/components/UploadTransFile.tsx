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
    console.log('fileItems', fileItems)
    // const formData = new FormData()
    // fileItems.forEach(file => formData.append('file', file as unknown as Blob))
    const updatedFiles: Array<FilePondInitialFile | File | Blob> = fileItems.map(
      fileItem => fileItem.file
    )
    // console.log('CHECK EXECUTION 2', formData)
    setFiles(updatedFiles)
  }

  const handleFileProcessed = (response: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
    const parsedResponse: ResponseFile = JSON.parse(response)
    console.log('response parse', parsedResponse)
    if (parsedResponse.ok && parsedResponse.data) {
      setUploadFilesInfo(prevState => [parsedResponse.data as UploadFileInfo, ...prevState])
      return 'success'
    }
    return 'failure'
  }

  console.log('files', files)
  console.log('uploadFilesInfo', uploadFilesInfo)

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
                console.error('Error uploading:', response)
              },
              ondata: formData => {
                console.log('formData onData method', formData)
                return formData
              }
            }
          }}
        />
      </div>
    </>
  )
}
