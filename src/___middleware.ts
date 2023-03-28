import { bootstrapMongoDB } from '@/config/database'
import { NextMiddleware, NextResponse } from 'next/server'

// eslint-disable-next-line no-void
void bootstrapMongoDB()

const middleware: NextMiddleware = (req, event) => {
  // You can add more logic here if needed.
  return NextResponse.next()
}

export default middleware
