/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-return-await */

'use client'

import type { FC } from 'react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCustomSession } from '@/hooks/useCustomSession'
import { Logout, Login } from '../../../components/icons'
import { HeaderProfileImg } from './HeaderProfileImg'

type PropsI = {
  classes?: string
}

export const Header: FC<PropsI> = ({ classes = '' }) => {
  const { data: session, status } = useCustomSession()
  const router = useRouter()

  const loginClasses = 'transform group-hover:scale-110'

  const loginHandler = () => {
    router.push('/user/signin')
  }

  const logoutHandler = async () => {
    await signOut({ callbackUrl: 'http://localhost:3000/user/signin' })
  }

  return (
    <div className={`h-16 flex items-center justify-between shadow-md ${classes}`}>
      <h3 className="text-2xl font-semibold cursor-pointer" onClick={() => router.push('/')}>
        ExpenseManager
      </h3>
      <div className="flex">
        {session?.user && (
          <div className="flex items-center gap-2 mr-10">
            <HeaderProfileImg classes="w-8 h-8" data={session} />
            <div>{session?.user?.name}</div>
          </div>
        )}
        <div
          className="flex flex-col items-center cursor-pointer group"
          onClick={status === 'authenticated' ? logoutHandler : loginHandler}
        >
          {status === 'authenticated' ? (
            <>
              <Logout width={20} height={20} className={loginClasses} />
              <p>Logout</p>
            </>
          ) : (
            <>
              <Login width={20} height={20} className={loginClasses} />
              <p>Login</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
