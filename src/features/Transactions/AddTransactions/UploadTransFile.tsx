'use client'

import { FilePond } from 'react-filepond'
import { useEffect, useState } from 'react'

import 'filepond/dist/filepond.min.css'

export const UploadTransFile = () => {
  const [files, setFiles] = useState<any[]>([])
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  console.log('files', files)

  return (
    <div className="file-wrapper" style={isReady ? { opacity: 1 } : undefined}>
      <FilePond
        files={files}
        allowMultiple
        maxFiles={3}
        onupdatefiles={fileItems => {
          setFiles(fileItems.map(fileItem => fileItem.file))
        }}
      />
    </div>
  )
}
