import { errorMessages } from '@/utils/const'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const imageUrl = url.searchParams.get('imageUrl')

  try {
    const response = await fetch(imageUrl ?? '')
    const arrayBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    // Convert ArrayBuffer to Buffer and set as body
    const buff = Buffer.from(arrayBuffer)
    return new NextResponse(buff, {
      headers: {
        'Content-Type': contentType,
        // Use byteLength property for ArrayBuffer
        'Content-Length': arrayBuffer.byteLength.toString()
      }
    })
  } catch (error) {
    console.log('ERROR =>', error)
    return NextResponse.json(
      { error: errorMessages.parsingImg },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}
