/* eslint-disable max-len */

import { errorMessages } from '@/utils/const'
import type { CategoryI, CustomSessionI } from '@/interfaces'
import { AddTransactions } from '@/features/Transactions/AddTransaction'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import UserModel from '@/models/user/UsersModel'

// Have to import the categories schema so the user schema can populate the categories array
import '@/models/categories/CategoriesModel'
import { ObjectId } from 'mongodb'
import { redirect } from 'next/navigation'

type SchemaCategoryI = CategoryI & {
  _id: ObjectId
}

async function getUserCategories() {
  try {
    const session: CustomSessionI | null = await getServerSession(authOptions)
    if (!session || !session.user?.id) {
      return { ok: false, error: errorMessages.relogAcc }
    }

    const user = await UserModel.findById(session.user.id).populate('categories').lean()
    if (!user) {
      return { ok: false, error: errorMessages.relogAcc }
    }

    // Need to use lean() (to avoid max stack oversize from the populate method)
    // using lean() I dont get the transformed object from the schema, so i have to parse the returned obj
    const transformedCategories: CategoryI[] = (
      user.categories as unknown as SchemaCategoryI[]
    ).map(category => {
      const { _id, ...restCategory } = category
      return {
        ...restCategory,
        id: category._id.toString()
      }
    })
    return { ok: true, userCategories: transformedCategories }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : errorMessages.gettingCategories
    return { ok: false, error: errorMessage }
  }
}

const Page = async () => {
  const userCategories = await getUserCategories()

  if (!userCategories.ok) {
    // TODO: set a toast with the userCategories.error message
    // Maybe just pass some data to the state (like react router)
    redirect(`/`)
  }

  return <AddTransactions userResponse={userCategories} />
}

export default Page
