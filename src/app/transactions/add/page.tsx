import { errorMessages } from '@/utils/const'
import { AddTransactions } from '@/features/Transactions/AddTransaction'
import { redirect } from 'next/navigation'
import { getUserCategories } from '@/repository/user'
import { CardContainer } from '@/components/styles/CardContainer'
import { headers } from 'next/headers'
import { JWT } from 'next-auth/jwt'

const getCategories = async () => {
  const headersList = headers().get('session')
  const session = JSON.parse(headersList ?? '') as JWT
  if (!headersList || !session || !session.id) {
    return { ok: false, error: errorMessages.relogAcc }
  }

  try {
    return getUserCategories(session.id as string)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : errorMessages.gettingCategories
    return { ok: false, error: errorMessage }
  }
}

const Page = async () => {
  const userCategories = await getCategories()

  // TODO: Set a redirect middleware in case user not logged. (redirect to login?)!
  // https://nextjs.org/docs/pages/building-your-application/routing/middleware
  if (!userCategories.ok && 'error' in userCategories) {
    redirect(`/`)
  }

  return (
    <CardContainer containerWidth="full">
      <AddTransactions userResponse={userCategories} />
    </CardContainer>
  )
}

export default Page
