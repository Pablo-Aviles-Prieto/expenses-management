import type { NextApiRequest, NextApiResponse } from 'next'

const proxyImage = async (req: NextApiRequest, res: NextApiResponse) => {
  const imageUrl = req.query.imageUrl as string

  try {
    const response = await fetch(imageUrl)
    const arrayBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Length', arrayBuffer.byteLength) // Use byteLength property for ArrayBuffer
    res.write(Buffer.from(arrayBuffer)) // Convert ArrayBuffer to Buffer and write it
    res.end() // End the response after writing the image data
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch the image' })
  }
}

export default proxyImage
