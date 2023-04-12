// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

const endpointController = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const userEmail = req.query.email

  console.log('session expenses/report', session)
  console.log('userEmail', userEmail)
  console.log('session?.user?.email', session?.user?.email)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  console.log('session?.user?.email !== req.body.email', session?.user?.email !== userEmail)

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (!session || session?.user?.email !== userEmail) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }
  res.status(200).json(session.user)
}

export default endpointController
