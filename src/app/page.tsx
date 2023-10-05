import { SummaryLanding } from '@/components/SummaryLanding'
import { headers } from 'next/headers'

function getSessionData() {
  const sessionError = headers().get('sessionError')
  return { hasError: sessionError }
}

const Home = () => {
  const { hasError } = getSessionData()

  return <SummaryLanding hasError={hasError} />
}

export default Home
