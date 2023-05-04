import connectDb from '@/config/mongooseDB'
import { errorMessages } from '@/utils/const'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import type { CustomSessionI } from '@/interfaces'
import UserModel from '@/models/user/UserModel'

// Have to import the categories schema so the user schema can populate the categories array
import '@/models/transactions/CategoriesModel'

const endpointController = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    res.status(405).json({ error: errorMessages.methodAllowed })
    return
  }

  try {
    await connectDb()

    const session = (await getSession({ req })) as CustomSessionI | null

    if (!session || !session.user?.id) {
      res.status(401).json({ error: ' There is an error with the user, please relog into your account' })
      return
    }

    const user = await UserModel.findById(session.user.id).populate('categories')
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    const { categories } = user

    res.status(200).json({ result: categories })
  } catch (err) {
    // TODO: Set the error message into the global error obj => errorMessages
    const errorMessage = err instanceof Error ? err.message : 'Error getting the categories'
    res.status(500).json({ error: errorMessage })
  }
}

export default endpointController
