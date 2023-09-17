import { CustomSessionI, ResponseUserI } from '@/interfaces'
import { URL_API, errorMessages } from '@/utils/const'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { getUser } from '@/repository/getUser'
import { UserInfo } from './UserInfo'

const URL = `${URL_API || ''}/api/user`

type IProps = {
  params: { userId: string }
}

type ResponseI = {
  ok: boolean
  user?: ResponseUserI
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
  console.log('data', data)

  return (
    <div>
      <UserInfo data={data} params={params} />
    </div>
  )
}

export default Page
