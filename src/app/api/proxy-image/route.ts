// import { errorMessages } from '@/utils/const'
import { NextRequest, NextResponse } from 'next/server'
// import { NextApiResponse } from 'next'

// const proxyImage = async (req: NextRequest, res: NextApiResponse) => {
//   console.log('req', req)
//   console.log('req.url', req.nextUrl.searchParams)
//   const url = new URL(req.url)
//   const imageUrl = url.searchParams.get('imageUrl')
//   console.log('imageUrl', imageUrl)

//   try {
//     const response = await fetch(imageUrl ?? '')
//     const arrayBuffer = await response.arrayBuffer()
//     const contentType = response.headers.get('content-type') || 'image/jpeg'
//     res.setHeader('Content-Type', contentType)
//     // Use byteLength property for ArrayBuffer
//     res.setHeader('Content-Length', arrayBuffer.byteLength)
//     res.write(Buffer.from(arrayBuffer)) // Convert ArrayBuffer to Buffer and write it
//     res.end() // End the response after writing the image data
//   } catch (error) {
//     res.status(500).json({ error: errorMessages.parsingImg })
//   }
// }

// export default proxyImage

export async function GET(req: NextRequest, res: NextResponse) {
  console.log('req.url', req.nextUrl.searchParams)
  const url = new URL(req.url)
  const imageUrl = url.searchParams.get('imageUrl')
  console.log('imageUrl', imageUrl)

  try {
    const response = await fetch(imageUrl ?? '')
    const arrayBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    // res.headers.set('Content-Type', contentType)
    // Use byteLength property for ArrayBuffer
    // res.headers.set('Content-Length', arrayBuffer.byteLength.toString())
    // Convert ArrayBuffer to Buffer and set as body
    const buff = Buffer.from(arrayBuffer)
    // res = new NextResponse(buff)
    // return res
    const newResponse = new NextResponse(buff, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': arrayBuffer.byteLength.toString()
      }
    })
    return newResponse
  } catch (error) {
    console.log('ERROR =>', error)
    // res.status(500).json({ error: errorMessages.parsingImg })
  }
}
