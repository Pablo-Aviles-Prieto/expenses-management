import { errorMessages } from '@/utils/const'
import type { CustomSessionI } from '@/interfaces'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'
import { getAllTransactionsPerUser } from '@/repository/transaction'
import { TransactionList } from '@/features/Transactions/TransactionList'
import { useCustomToast } from '@/hooks'

const getTransactions = async () => {
  try {
    const session: CustomSessionI | null = await getServerSession(authOptions)
    if (!session || !session.user?.id) {
      return { ok: false, error: errorMessages.relogAcc }
    }

    return getAllTransactionsPerUser(session.user.id)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : errorMessages.gettingCategories
    return { ok: false, error: errorMessage }
  }
}

const Page = async () => {
  const transResponse = await getTransactions()
  const { showToast } = useCustomToast()

  if (!transResponse.ok && 'error' in transResponse) {
    showToast({
      msg: transResponse.error,
      options: { type: 'error' }
    })
    // TODO:? Maybe just pass some data to the state (like react router)
    redirect(`/`)
  }

  return <TransactionList transResponse={transResponse} />
}

export default Page
