import type { NextApiRequest } from 'next'
import { NextRequest } from 'next/server'

export interface DecodedUser {
  name: string
  email: string
}

export interface ExtendedApiRequest extends NextApiRequest {
  user: DecodedUser
}

export interface ExtendedRequest extends NextRequest {
  user: DecodedUser
}
