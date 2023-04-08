/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-return-await */
import type { FC } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Logout, Login } from '../icons'

type PropsI = {
  classes?: string
}

export const Header: FC<PropsI> = ({ classes = '' }) => {
  const { data: session, status } = useSession()
  const router = useRouter()

  const loginClasses = 'cursor-pointer hover:transform hover:scale-110'

  const loginHandler = async () => {
    // eslint-disable-next-line no-void
    void (await router.push('/user/signin'))
  }

  return (
    <div className={`h-16 flex items-center justify-between shadow-md ${classes}`}>
      <h3 className="text-2xl font-semibold cursor-pointer" onClick={() => router.push('/')}>
        ExpenseManager
      </h3>
      <div>
        {status === 'authenticated' ? (
          <Logout width={20} height={20} className={loginClasses} />
        ) : (
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          <Login width={20} height={20} className={loginClasses} onClick={loginHandler} />
        )}
      </div>
    </div>
  )
}

Header.defaultProps = {
  classes: ''
}
