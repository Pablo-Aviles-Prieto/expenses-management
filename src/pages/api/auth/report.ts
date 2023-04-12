// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

const endpointController = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  console.log('session auth/report', session)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  console.log('req.body.email', req.body.email)

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (!session || session?.user?.email !== req.body.email) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }
  res.status(200).json(session.user)
}

export default endpointController
