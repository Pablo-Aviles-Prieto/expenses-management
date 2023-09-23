import { errorMessages } from '@/utils/const'
import type { CategoryI, CustomSessionI } from '@/interfaces'
import { AddTransactions } from '@/features/Transactions/AddTransaction'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { ObjectId } from 'mongodb'
import { redirect } from 'next/navigation'
import { getUserCategories } from '@/repository/user'
import { useCustomToast } from '@/hooks'
import { CardContainer } from '@/components/styles/CardContainer'

type SchemaCategoryI = CategoryI & {
  _id: ObjectId
}

const getCategories = async () => {
  try {
    const session: CustomSessionI | null = await getServerSession(authOptions)
    if (!session || !session.user?.id) {
      return { ok: false, error: errorMessages.relogAcc }
    }

    return getUserCategories(session.user.id)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : errorMessages.gettingCategories
    return { ok: false, error: errorMessage }
  }
}

const Page = async () => {
  const userCategories = await getCategories()
  const { showToast } = useCustomToast()

  if (!userCategories.ok && 'error' in userCategories) {
    showToast({
      msg: userCategories.error,
      options: { type: 'error' }
    })
    // TODO:? Maybe just pass some data to the state (like react router)
    redirect(`/`)
  }

  return (
    <CardContainer containerWidth="full">
      <AddTransactions userResponse={userCategories} />
    </CardContainer>
  )
}

export default Page
