import { errorMessages } from '@/utils/const'
import { getUser } from '@/repository/user'
import { UserInfo } from '@/features/UserInfo/UserInfo'
import { CardContainer } from '@/components/styles/CardContainer'
import { headers } from 'next/headers'
import { JWT } from 'next-auth/jwt'

type IProps = {
  params: { userId: string }
}

async function getUserData(userId: string) {
  const headersList = headers().get('session')
  const session = JSON.parse(headersList ?? '') as JWT

  try {
    if (session?.id !== userId) {
      return { ok: false, error: errorMessages.authorizedResource }
    }
    return getUser(userId)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : errorMessages.gettingCategories
    return { ok: false, error: errorMessage }
  }
}

const Page = async ({ params }: IProps) => {
  const { userId } = params
  const data = await getUserData(userId)

  return (
    <CardContainer containerWidth="full">
      <UserInfo data={data} params={params} />
    </CardContainer>
  )
}

export default Page
