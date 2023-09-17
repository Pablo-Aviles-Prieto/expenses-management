/* eslint-disable @typescript-eslint/no-unsafe-member-access */

'use client'

import { FC } from 'react'
// import { ResponseUserI } from '@/interfaces'
import { redirect } from 'next/navigation'
import { ResponseUserI } from '@/interfaces'

type Props = {
  data: {
    ok: boolean
    user?: ResponseUserI | null
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
