import { errorMessages } from '@/utils/const'
import { getAllTransactionsPerUser } from '@/repository/transaction'
import { Transactions } from '@/features/Transactions/Transactions'
import { headers } from 'next/headers'
import { JWT } from 'next-auth/jwt'

const getTransactions = async () => {
  const headersList = headers().get('session')
  const session = JSON.parse(headersList ?? '') as JWT
  try {
    return getAllTransactionsPerUser(session?.id as string)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : errorMessages.gettingCategories
    return { ok: false, error: errorMessage }
  }
}

const Page = async () => {
  const transResponse = await getTransactions()

  // TODO: IMPORTANT check in the child if transResponse.error exist and work accordingly
  // is broking when no data since date-fns throwing error
  return <Transactions transResponse={transResponse} />
}

export default Page
