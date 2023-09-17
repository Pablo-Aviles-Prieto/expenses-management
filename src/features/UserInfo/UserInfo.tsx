'use client'

import { FC } from 'react'
import { redirect } from 'next/navigation'
import { UserI } from '@/interfaces/Responses'

type Props = {
  data: {
    ok: boolean
    user?: UserI | null
    error?: string
  }
  params: { userId: string }
}

export const UserInfo: FC<Props> = ({ data, params }) => {
  if (data.error) {
    // TODO: Seat a toast ?
    redirect('/')
  }

  return (
    <h1>
      Welcome back {data?.user?.name} ({params.userId})
    </h1>
  )
}
