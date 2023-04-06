import { type MutableRefObject, useCallback, useRef, useState } from 'react'
import { keyIsEmptyArray } from '@/utils/validations'
import { useFetch } from './useFetch'

const defaultArgs = {
  method: 'GET'
}

type Args<T> = {
  url: string | null
  args?: Record<string, any>
  fetchOnMount?: boolean
  token: string
  checkOptions?: {
    keyToCheck?: T extends object ? keyof T : never
    checkIsEmpty?: MutableRefObject<boolean>
    checkOnMount?: boolean
  }
}

export type MakeRequestParams = {
  signal?: AbortSignal
  checkIsEmpty?: boolean
}

export const useQuery = <T,>({ url, args, token, fetchOnMount = true, checkOptions }: Args<T>) => {
  const { keyToCheck, checkIsEmpty, checkOnMount = true } = checkOptions ?? {}

  const [data, setData] = useState<T | undefined>(undefined)
  const [errorState, setError] = useState<Error | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  const renderCount = useRef(0)
  const { fetchWithToken } = useFetch()

  const makeRequest = useCallback(
    async (params?: MakeRequestParams) => {
      const { signal, checkIsEmpty: checkedEmpty } = params || {}

      const shouldCheckIsEmpty = checkIsEmpty && (checkOnMount || renderCount.current > 0)

      if (url) {
        try {
          setLoading(true)
          const response = await fetchWithToken<T>(url, token, {
            ...(args || defaultArgs),
            signal
          })

          const responseIsEmptyArray = Array.isArray(response) && response.length === 0

          const isEmpty = keyIsEmptyArray(response, keyToCheck) || responseIsEmptyArray

          setData(response)
        } catch (error) {
          if (error instanceof DOMException && error.name === 'AbortError') {
            return
          }
          if (error instanceof Error) {
            setError(error)
          } else {
            setError(new Error('An unknown error occurred.'))
          }
        } finally {
          setLoading(false)
        }
      } else {
        setData(undefined)
        setError(undefined)
        setLoading(false)
      }
    },
    [url, args, fetchWithToken, keyToCheck, checkOnMount]
  )

  const refreshQuery = () => {
    setData(undefined)
    setError(undefined)
    setLoading(false)
  }

  // useEffect(() => {
  //   const abortController = new AbortController()

  //   if (fetchOnMount || renderCount.current > 0) {
  //     makeRequest({ signal: abortController.signal, checkIsEmpty: checkIsEmpty?.current })

  //     if (checkIsEmpty?.current === false) {
  //       checkIsEmpty.current = true
  //     }

  //     return () => {
  //       abortController.abort()
  //     }
  //   }
  //   renderCount.current += 1
  // }, [makeRequest, fetchOnMount, checkIsEmpty])

  return { data, error: errorState, loading, refetch: makeRequest, refreshQuery }
}
