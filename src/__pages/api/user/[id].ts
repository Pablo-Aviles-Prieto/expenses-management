import type { NextApiResponse, NextApiRequest } from 'next'
import UserModel from '@/models/user/UserModel'
import connectDb from '@/config/mongooseDB'
import mongoose from 'mongoose'
import { getToken } from 'next-auth/jwt'
import { errorMessages } from '@/utils/const'

const endpointController = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    res.status(405).json({ error: errorMessages.methodAllowed })
    return
  }

  const { id } = req.query

  if (typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: errorMessages.invalidUserId })
  }

  try {
    const tokenNext = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!tokenNext || tokenNext.id !== id) {
      res.status(401).json({ error: errorMessages.authorizedResource })
      return
    }

    await connectDb()

    const user = await UserModel.findById(id)
    res.status(200).json({ user })
  } catch (error) {
    console.error('ERROR', error)
    res.status(500).json({ error: errorMessages.generic })
  }
}

export default endpointController
