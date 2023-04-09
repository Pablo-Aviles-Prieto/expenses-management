/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-return-await */
import type { FC } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Logout, Login } from '../icons'

type PropsI = {
  classes?: string
}

export const Header: FC<PropsI> = ({ classes = '' }) => {
  const { data: session, status } = useSession()
  const router = useRouter()

  const loginClasses = 'transform group-hover:scale-110'

  const loginHandler = async () => {
    await router.push('/user/signin')
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
            <div>Photo</div>
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

Header.defaultProps = {
  classes: ''
}
