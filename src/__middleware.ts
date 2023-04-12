import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { DecodedUser, ExtendedRequest } from '@/interfaces'
import connectDb from './config/mongooseDB'

export async function middleware(req: ExtendedRequest): Promise<NextRequest | void> {
  const { pathname } = req.nextUrl

  // Check if the request is for /api/user/:id
  if (pathname.startsWith('/api/user/')) {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      NextResponse.error()
      return
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET ?? '')
      console.log('req', req.body)

      if (typeof decoded === 'string') throw new Error()
      req.user = decoded as DecodedUser
    } catch (error) {
      console.log('error', error)
      NextResponse.error()
      return
    }
  }

  // Check if the request is for /api/login
  if (pathname.startsWith('/api/login')) {
    try {
      await connectDb()
    } catch (error) {
      console.error(`Error connecting to mongo database, Error description: ${(error as Error).message}`)
      NextResponse.error()
    }
  }
  NextResponse.next()
}
