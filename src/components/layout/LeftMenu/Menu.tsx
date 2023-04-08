/* eslint-disable no-void */
import type { FC } from 'react'
import { useRouter } from 'next/router'
import { useCustomSession } from '@/hooks/useCustomSession'

export const Menu: FC = () => {
  const { data: session } = useCustomSession()
  const router = useRouter()

  const handleNavigate = () => {
    if (!session?.user) {
      void router.push(`/user/signin`)
      return
    }
    void router.push(`/user/${session.user.id}/details`)
  }

  return (
    <div className="h-48 my-6">
      <p>Menu</p>
      <button type="button" onClick={handleNavigate}>
        Go to profile
      </button>
    </div>
  )
}
