/* eslint-disable max-len */
import { useCallback } from 'react'

type ErrorI = {
  error: string
}

export function useFetch() {
  const fetchPetition = useCallback(
    async <DataType = any>(url: string, args?: { [x: string]: any }, jsonResponse = true): Promise<DataType> => {
      try {
        const res = await fetch(url, {
          ...args,
          headers: { 'Content-Type': 'application/json' }
        })

        if (!res.ok) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const error: ErrorI = JSON.parse(await res.text())
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access

          // TODO: set toast
          // notify(<ToastContent title="ERROR" type="error" description={error.error} />)
          throw new Error(error.error)
          // throw new Error(res.statusText)
        }

        return jsonResponse ? ((await res.json()) as DataType) : ((await res.text()) as DataType)
      } catch (error) {
        console.error('error', error)
        throw error
      }
    },
    []
  )

  return { fetchPetition }
}
