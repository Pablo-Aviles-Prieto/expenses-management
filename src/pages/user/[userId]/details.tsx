import { useRouter } from 'next/router'
import { ResponseUserI } from '@/interfaces'
import { URL_API } from '@/utils/const'
import { NextPageContext } from 'next'
import { FC, useEffect } from 'react'

const URL = `${URL_API || ''}/api/user`

type IProps = {
  userData: ResponseI | undefined
}

type ResponseI = {
  user?: ResponseUserI
  error?: string
}

export async function getServerSideProps(context: NextPageContext) {
  const { userId } = context.query
  const cookies = context.req?.headers.cookie || ''

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  if (typeof userId !== 'string') return
  const res: Response = await fetch(`${URL}/${userId}`, {
    headers: {
      cookie: cookies
    }
  })
  const data = (await res.json()) as ResponseI

  return {
    props: {
      userData: data
    }
  }
}

const UserDetails: FC<IProps> = ({ userData }) => {
  const router = useRouter()

  useEffect(() => {
    if (userData?.error) {
      console.log('ERROR', userData.error)
      // eslint-disable-next-line no-void
      void router.push('/')
    }
  }, [userData, router])

  return (
    <div>
      <h1>Welcome back {userData?.user?.name}</h1>
      {/* Render user details here */}
    </div>
  )
}

export default UserDetails
