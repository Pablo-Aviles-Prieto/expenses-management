import type { NextApiResponse } from 'next'
import { ExtendedRequest } from '@/interfaces'
import authJWTMiddleware from '@/utils/authJWTMiddleware'

type Data = {
  name: string
}

const endpointController = (req: ExtendedRequest, res: NextApiResponse<Data>) => {
  res.status(200).json({ name: 'John Doe' })
}

export default authJWTMiddleware(endpointController)
