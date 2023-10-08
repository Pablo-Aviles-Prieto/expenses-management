'use client'

import { FC } from 'react'
import { redirect } from 'next/navigation'
import { UserI } from '@/interfaces/User'
import { useCustomToast } from '@/hooks'

type Props = {
  data: {
    ok: boolean
    user?: UserI | null
    error?: string
  }
  params: { userId: string }
}

export const UserInfo: FC<Props> = ({ data, params }) => {
  const { showToast } = useCustomToast()

  if (data.error) {
    showToast({
      msg: data.error,
      options: { type: 'error' }
    })
    redirect('/')
  }

  return (
    <h1>
      Welcome back {data?.user?.name} ({params.userId})
    </h1>
  )
}
