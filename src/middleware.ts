import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { errorMessages } from './utils/const'

const USER_DETAILS_PATH = /^\/user\/([^/]+)\/details$/ // /user/:mongoId/details

export default async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const headers = new Headers(req.headers)
  const url = req.nextUrl.clone()

  if (!session) {
    headers.set('sessionError', errorMessages.relogAcc)
    url.pathname = '/user/signin'
    return NextResponse.rewrite(url, { headers })
  }

  // Matching /user/650b4e6cb496dc4f48a3a9e2/details
  const match = req.nextUrl.pathname.match(USER_DETAILS_PATH)
  // match[1] === mongoid
  if (match && match[1] !== session?.id) {
    headers.set('sessionError', errorMessages.authorizedResource)
    url.pathname = '/'
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
  matcher: ['/transactions/:path*', '/user/:path*/details']
}
