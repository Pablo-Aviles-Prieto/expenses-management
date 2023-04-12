/* eslint-disable no-void */
import type { FC } from 'react'
import { useRouter } from 'next/router'
import { useCustomSession } from '@/hooks/useCustomSession'

export const Menu: FC = () => {
  const { data: session } = useCustomSession()
  const router = useRouter()

  const navigateToProfile = () => {
    if (!session?.user) {
      void router.push(`/user/signin`)
      return
    }
    void router.push(`/user/${session.user.id}/details`)
  }

  const navigateToRegister = () => {
    void router.push('/user/signup')
  }

  return (
    <div className="flex flex-col h-48 gap-3 my-6">
      <p>Menu</p>
      <button type="button" onClick={navigateToProfile}>
        {!session?.user ? 'Login' : 'My profile'}
      </button>
      <button type="button" onClick={navigateToRegister}>
        Register
      </button>
    </div>
  )
}
