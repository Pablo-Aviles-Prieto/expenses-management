import connectDb from '@/config/mongooseDB'
import { errorMessages } from '@/utils/const'
import { NextApiRequest, NextApiResponse } from 'next'

const endpointController = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: errorMessages.methodAllowed })
    return
  }

  try {
    await connectDb()

    res.status(200).json({ result: 'TEST OK' })
  } catch (err) {
    // TODO: Set the error message into the global error obj => errorMessages
    const errorMessage = err instanceof Error ? err.message : 'Error getting the categories'
    res.status(500).json({ error: errorMessage })
  }
}

export default endpointController
