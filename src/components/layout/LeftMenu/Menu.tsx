/* eslint-disable no-void */

'use client'

import type { FC } from 'react'
import { useRouter } from 'next/navigation'
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
      router.push(`/user/signin`)
      return
    }
    router.push(`/user/${session.user.id}/details`)
  }

  const navigateToPath = (path: string) => {
    router.push(path)
  }

  return (
    <div className="flex flex-col h-48 gap-3 my-6">
      <p>Personal Menu</p>
      {session === undefined ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <button type="button" onClick={navigateToProfile}>
            {!session?.user ? 'Login' : 'My profile'}
          </button>
          <>
            {navPages.map(page => {
              return (!page.needAuth && !session?.user) || (page.needAuth && session?.user) ? (
                <button key={page.path} type="button" onClick={() => navigateToPath(page.path)}>
                  {page.label}
                </button>
              ) : null
            })}
          </>
        </>
      )}
    </div>
  )
}
