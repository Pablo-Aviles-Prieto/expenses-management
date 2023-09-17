import { CustomSessionI } from '@/interfaces'
import { URL_API, errorMessages } from '@/utils/const'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { getUser } from '@/repository/User'
import { UserInfo } from '@/features/UserInfo/UserInfo'
import { UserI } from '@/interfaces/Responses'

const URL = `${URL_API || ''}/api/user`

type IProps = {
  params: { userId: string }
}

type ResponseI = {
  ok: boolean
  user?: UserI
  error?: string
}

// TODO: Use either the API endpoint or the getUser repo logic
async function getUserData(userId: string) {
  const session: CustomSessionI | null = await getServerSession(authOptions)
  if (!session || session?.user?.id !== userId) {
    return { ok: false, error: errorMessages.authorizedResource }
  }
  const res = await getUser(userId)
  // const res = await fetch(`${URL}/${userId}`)
  return res
  // return res.json() as Promise<ResponseI>
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
