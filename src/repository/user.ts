/* eslint-disable max-len */
import UserModel from '@/models/user/UsersModel'
import connectDb from '@/config/mongooseDB'
import { errorMessages } from '@/utils/const'
import { ObjectId } from 'mongoose'
import { UserI } from '@/interfaces/User'
import { CategoryI } from '@/interfaces'
import { isInvalidUserId } from '@/utils/isInvalidUserId'

import '@/models/categories/CategoriesModel'

type SchemaCategoryI = CategoryI & {
  _id: ObjectId
}

export const getUser = async (userId: string) => {
  if (isInvalidUserId(userId)) {
    throw new Error(errorMessages.invalidUserId)
  }

  await connectDb()
  const userData = await UserModel.findById(userId)
  const user = JSON.parse(JSON.stringify(userData)) as UserI
  return { ok: true, user }
}

export const getUserCategories = async (userId: string) => {
  if (isInvalidUserId(userId)) {
    throw new Error(errorMessages.invalidUserId)
  }

  await connectDb()
  const user = await UserModel.findById(userId).populate('categories').lean()
  if (!user) {
    throw new Error(errorMessages.relogAcc)
  }

  // Need to use lean() (to avoid max stack oversize from the populate method)
  // using lean() I dont get the transformed object from the schema, so i have to parse the returned obj
  const transformedCategories: CategoryI[] = (user.categories as unknown as SchemaCategoryI[]).map(
    category => {
      const { _id, ...restCategory } = category
      return {
        ...restCategory,
        id: category._id.toString()
      }
    }
  )
  return { ok: true, userCategories: transformedCategories }
}
