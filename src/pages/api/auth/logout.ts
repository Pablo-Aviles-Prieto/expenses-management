// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
// import connectDb from '@/config/mongooseDB'
import { UserModel } from '@/models'

type Data = {
  mock: any
  DB: any
}

const endpointController = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  // await connectDb()
  const result = await UserModel.find()
  res.status(200).json({ mock: [{ name: 'John Doe' }], DB: result })
}

export default endpointController
