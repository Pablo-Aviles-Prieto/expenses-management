import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { DecodedUser, ExtendedApiRequest } from '@/interfaces'

const authJWTMiddleware = (handler: (req: ExtendedApiRequest, res: NextApiResponse) => Promise<void>) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ message: 'Auth token is missing' })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET ?? '')

      if (typeof decoded === 'string') throw new Error()
      ;(req as ExtendedApiRequest).user = decoded as DecodedUser

      return handler(req as ExtendedApiRequest, res)
    } catch (error) {
      console.log('error', error)
      return res.status(401).json({ message: 'Invalid auth token' })
    }
  }
}

export default authJWTMiddleware
