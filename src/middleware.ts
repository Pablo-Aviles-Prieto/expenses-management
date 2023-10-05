import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const headers = new Headers(req.headers)

  if (!session) {
    return NextResponse.redirect('/login', 401)
  }

  headers.set('session', JSON.stringify(session))
  return NextResponse.next({
    request: {
      headers
    }
  })
}

export const config = {
  matcher: '/transactions/:path*'
}
