import type { NextApiResponse } from 'next'
import { ExtendedRequest } from '@/interfaces'
import authJWTMiddleware from '@/utils/authJWTMiddleware'
import { getDb } from '@/config/database'
import mongoose from 'mongoose'

type Data = {
  result: any[]
  user: any
}

const endpointController = async (req: ExtendedRequest, res: NextApiResponse) => {
  let db: mongoose.mongo.Db | null = null

  try {
    db = await getDb()
  } catch (error) {
    console.error(`Error connecting to mongo database, Error description: ${(error as Error).message}`)
    return
  }
  try {
    const result = await db.collection('users').find({}).toArray()
    res.status(200).json({ result, user: req.user })
  } catch (error) {
    res.status(500).json({ error: 'Something happened' })
  }
}

export default authJWTMiddleware(endpointController)
