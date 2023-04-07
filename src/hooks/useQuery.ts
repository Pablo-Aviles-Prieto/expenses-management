import { type MutableRefObject, useCallback, useRef, useState, useEffect } from 'react'
import { keyIsEmptyArray } from '@/utils/validations'
import { useFetch } from './useFetch'

const defaultArgs = {
  method: 'GET'
}

type Args<T> = {
  url: string | null
  args?: Record<string, any>
  fetchOnMount?: boolean
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

const makeIsEmptyToast = () => {
  // TODO: set toast
  console.log('EMPTY search')
  // notify(
  //   <ToastContent type="informative" title="INFO" description="No results found for this search" />,
  // )
}

export const useQuery = <T>({ url, args, fetchOnMount = true, checkOptions }: Args<T>) => {
  const { keyToCheck, checkIsEmpty, checkOnMount = true } = checkOptions ?? {}
  const [data, setData] = useState<T | undefined>(undefined)
  const [errorState, setError] = useState<Error | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const renderCount = useRef(0)
  const { fetchWithToken } = useFetch()

  if (renderCount.current === 0 && fetchOnMount) {
    renderCount.current += 1
  }

  const makeRequest = useCallback(
    async (params?: MakeRequestParams, dynamicArgs?: Record<string, any>) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { signal, checkIsEmpty = true } = params || {}

      const shouldCheckIsEmpty = checkIsEmpty && (checkOnMount || renderCount.current > 0)

      if (url) {
        try {
          setLoading(true)
          setError(undefined)

          const response = await fetchWithToken<T>(url, {
            ...(args || defaultArgs),
            ...dynamicArgs,
            signal
          })

          const responseIsEmptyArray = Array.isArray(response) && response.length === 0

          const isEmpty = keyIsEmptyArray(response, keyToCheck) || responseIsEmptyArray

          if (shouldCheckIsEmpty && isEmpty) {
            makeIsEmptyToast()
          }

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

  useEffect(() => {
    const abortController = new AbortController()

    if (fetchOnMount || renderCount.current > 1) {
      // eslint-disable-next-line no-void
      void makeRequest({ signal: abortController.signal, checkIsEmpty: checkIsEmpty?.current })

      if (checkIsEmpty?.current === false) {
        checkIsEmpty.current = true
      }

      return () => {
        abortController.abort()
      }
    }
    renderCount.current += 1
  }, [makeRequest, fetchOnMount, checkIsEmpty])

  return {
    data,
    error: errorState,
    loading,
    refetch: (dynamicArgs?: Record<string, any>) => makeRequest(undefined, dynamicArgs),
    refreshQuery
  }
}
