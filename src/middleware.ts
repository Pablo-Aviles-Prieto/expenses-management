import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { errorMessages } from './utils/const'

export default async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const headers = new Headers(req.headers)

  if (!session) {
    headers.set('sessionError', errorMessages.relogAcc)
    const url = req.nextUrl.clone()
    url.pathname = '/user/signin'
    return NextResponse.rewrite(url, { headers })
  }

  headers.set('session', JSON.stringify(session))
  return NextResponse.next({
    request: {
      headers
    }
  })
}

// Middleware working on pages paths only (no api)
export const config = {
  matcher: '/transactions/:path*'
}
