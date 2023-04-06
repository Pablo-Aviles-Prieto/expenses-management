// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

const endpointController = (req: NextApiRequest, res: NextApiResponse<Data>) => {
  console.log('test')
  res.status(200).json({ name: 'John Doe' })
}

export default endpointController
