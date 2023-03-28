import type { NextApiRequest } from 'next'

export interface DecodedUser {
  name: string
  email: string
}

export interface ExtendedRequest extends NextApiRequest {
  user: DecodedUser
}
