/* eslint-disable @typescript-eslint/no-misused-promises */
import React from 'react'
import { signIn, useSession } from 'next-auth/react'

const fetchExpenses = async (email: string) => {
  console.log('email', email)
  const response = await fetch(`/api/expenses/report?email=${email}`)
  // const response = await fetch('/api/expenses/report')
  // const response = await fetch('/api/expenses/report', {
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   method: 'POST',
  //   body: JSON.stringify({ email })
  // })

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const expenses = await response.json()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return expenses
}

const LoginButton: React.FC = () => {
  const { data: session, status } = useSession()
  console.log('session', session)
  console.log('status', status)

  const handleSignIn = async () => {
    await signIn('google')
  }

  const fetchHandler = async (email: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = await fetchExpenses(email)
    console.log('response', response)
  }

  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <button type="button" onClick={handleSignIn} className="your-button-styles">
        Sign in with Google
      </button>
      {status === 'authenticated' && (
        <>
          <p className="pt-8">User authed</p>
          <button
            type="button"
            onClick={async () => {
              if (session?.user?.email) {
                return fetchHandler(session.user.email)
              }
              return fetchHandler('')
            }}
          >
            Fetch /api/auth/report
          </button>
        </>
      )}
    </>
  )
}

export default LoginButton
