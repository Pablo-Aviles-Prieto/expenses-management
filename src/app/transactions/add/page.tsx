/* eslint-disable max-len */
import { errorMessages } from '@/utils/const'
import { getUserCategories } from '@/repository/user'
import { headers } from 'next/headers'
import { JWT } from 'next-auth/jwt'
import { AddTransactionsContainer } from '@/features/Transactions/AddTransactions/components/AddTransactionsContainer'

const getCategories = async () => {
  const headersList = headers().get('session')
  const session = JSON.parse(headersList ?? '') as JWT

  try {
    return getUserCategories(session?.id as string)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : errorMessages.gettingCategories
    return { ok: false, error: errorMessage }
  }
}

const Page = async () => {
  const userResponse = await getCategories()

  // TODO: check in the child if userResponse.error exist and work accordingly
  return <AddTransactionsContainer userResponse={userResponse} />
}

export default Page
