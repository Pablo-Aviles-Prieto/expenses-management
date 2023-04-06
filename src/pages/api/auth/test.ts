import { getSession } from 'next-auth/react'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'

const secret = process.env.JWT_SECRET

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const token = await getToken({ req, secret })
  console.log('session', session)
  console.log('token', token)
  console.log('req', req)
  // res.send(JSON.stringify(session, null, 2))
  res.send(JSON.stringify(token, null, 2))
}
