/* eslint-disable no-void */
import type { FC } from 'react'
import { useRouter } from 'next/router'
import { useCustomSession } from '@/hooks/useCustomSession'

// Order matters for rendering
const navPages = [
  {
    label: 'Register',
    path: '/user/signup',
    needAuth: false
  },
  {
    label: 'Transactions',
    path: `/transactions/`,
    needAuth: true
  },
  {
    label: 'Add transaction',
    path: `/transactions/add`,
    needAuth: true
  }
]

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

  const navigateToPath = (path: string) => {
    void router.push(path)
  }

  return (
    <div className="flex flex-col h-48 gap-3 my-6">
      <p>Personal Menu</p>
      <button type="button" onClick={navigateToProfile}>
        {!session?.user ? 'Login' : 'My profile'}
      </button>
      {navPages.map(page => {
        return (!page.needAuth && !session?.user) || (page.needAuth && session?.user) ? (
          <button key={page.path} type="button" onClick={() => navigateToPath(page.path)}>
            {page.label}
          </button>
        ) : null
      })}
    </div>
  )
}
