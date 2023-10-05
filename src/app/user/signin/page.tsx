import { CardContainer } from '@/components/styles/CardContainer'
import SignIn from '@/features/SignIn/SignIn'
import { CustomSessionI } from '@/interfaces'
import { authOptions } from '@/lib/authOptions'
import { getServerSession } from 'next-auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

async function getSessionData() {
  const sessionError = headers().get('sessionError')
  const session: CustomSessionI | null = await getServerSession(authOptions)
  return { session, hasError: sessionError }
}

const Page = async () => {
  const { session, hasError } = await getSessionData()

  if (session && session.user) {
    redirect(`/user/${session.user.id}/details`)
  }

  return (
    <CardContainer containerWidth="xl">
      <SignIn hasError={hasError} />
    </CardContainer>
  )
}

export default Page
