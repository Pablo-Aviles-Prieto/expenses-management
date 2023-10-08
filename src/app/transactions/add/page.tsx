import { errorMessages } from '@/utils/const'
import { AddTransactions } from '@/features/Transactions/AddTransactions/components/AddTransaction'
import { getUserCategories } from '@/repository/user'
import { CardContainer } from '@/components/styles/CardContainer'
import { headers } from 'next/headers'
import { JWT } from 'next-auth/jwt'
import { UploadTransFile } from '@/features/Transactions/AddTransactions/components/UploadTransFile'

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
  return (
    <>
      <CardContainer containerWidth="full">
        <UploadTransFile />
      </CardContainer>
      <CardContainer containerWidth="full">
        <AddTransactions userResponse={userResponse} />
      </CardContainer>
    </>
  )
}

export default Page
