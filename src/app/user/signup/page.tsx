import { CardContainer } from '@/components/styles/CardContainer'
import SignUp from '@/features/SignUp/SignUp'
import { CustomSessionI } from '@/interfaces'
import { authOptions } from '@/lib/authOptions'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

async function getSessionData() {
  const session: CustomSessionI | null = await getServerSession(authOptions)
  return session
}

const Page = async () => {
  const session = await getSessionData()

  if (session && session.user) {
    redirect(`/user/${session.user.id}/details`)
  }

  return (
    <CardContainer containerWidth="xl">
      <SignUp />
    </CardContainer>
  )
}

export default Page
