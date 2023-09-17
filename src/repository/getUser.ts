import connectDb from '@/config/mongooseDB'
import { ResponseUserI } from '@/interfaces'
import UserModel from '@/models/user/UserModel'
import { errorMessages } from '@/utils/const'
import mongoose from 'mongoose'

export const getUser = async (userId: string) => {
  if (typeof userId !== 'string' || !mongoose.Types.ObjectId.isValid(userId)) {
    return { ok: false, error: errorMessages.invalidUserId }
  }

  try {
    await connectDb()

    const userData = await UserModel.findById(userId)
    const user = JSON.parse(JSON.stringify(userData)) as ResponseUserI
    return { ok: true, user }
  } catch (error) {
    return { ok: false, error: errorMessages.generic }
  }
}
