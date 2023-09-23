import { CustomSessionI } from '@/interfaces'
import { URL_API, errorMessages } from '@/utils/const'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { getUser } from '@/repository/user'
import { UserInfo } from '@/features/UserInfo/UserInfo'
import { UserI } from '@/interfaces/User'

const URL = `${URL_API || ''}/api/user`

type IProps = {
  params: { userId: string }
}

type ResponseI = {
  ok: boolean
  user?: UserI
  error?: string
}

async function getUserData(userId: string) {
  try {
    const session: CustomSessionI | null = await getServerSession(authOptions)
    if (!session || session?.user?.id !== userId) {
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
    <div>
      <UserInfo data={data} params={params} />
    </div>
  )
}

export default Page
