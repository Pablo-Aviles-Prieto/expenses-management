import connectDb from '@/config/mongooseDB'
import UserModel from '@/models/user/UserModel'
import { errorMessages } from '@/utils/const'
import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (req: NextRequest, { params }: { params: { userId: string } }) => {
  const { userId } = params
  if (typeof userId !== 'string' || !mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ ok: false, error: errorMessages.invalidUserId }, { status: 400 })
  }

  try {
    await connectDb()

    const user = await UserModel.findById(userId)
    return NextResponse.json({ ok: true, user }, { status: 200 })
  } catch (error) {
    console.error('ERROR', error)
    return NextResponse.json({ ok: false, error: errorMessages.generic }, { status: 500 })
  }
}
