/* eslint-disable max-len */
const API_URL = 'http://localhost:3000/api'

export function useFetch() {
  const fetchWithToken = async <DataType = any,>(
    url: string,
    token: string,
    args?: { [x: string]: any },
    jsonResponse = true
  ): Promise<DataType> => {
    try {
      const res = await fetch(url, {
        ...args,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!res.ok) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const error = JSON.parse(await res.text())
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
        const errorToDisplay = `${error.code} - ${error.message}`

        // TODO: set toast
        // notify(<ToastContent title="ERROR" type="error" description={errorToDisplay} />)
        throw new Error(res.statusText)
      }

      return jsonResponse ? ((await res.json()) as DataType) : ((await res.text()) as DataType)
    } catch (error) {
      console.error('error', error)
      throw error
    }
  }

  return { fetchWithToken }
}
