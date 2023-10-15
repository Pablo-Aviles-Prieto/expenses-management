import connectDb from '@/config/mongooseDB'
import { TransactionObjI } from '@/interfaces'
import { errorMessages } from '@/utils/const'
import { isValidTransaction } from '@/utils/isValidTransaction'
import UserModel from '@/models/user/UsersModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import CategoriesModel from '@/models/categories/CategoriesModel'
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter'

interface ReqObjI {
  transactions: TransactionObjI[]
}

export const POST = async (req: NextRequest) => {
  const data = (await req.json()) as ReqObjI
  const { transactions } = data

  if (transactions.length === 0 || !transactions.every(isValidTransaction)) {
    return NextResponse.json({ ok: false, error: errorMessages.missingData }, { status: 400 })
  }

  try {
    await connectDb()

    // TODO: Separate it into a service to get the user id??
    const tokenNext = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!tokenNext || !tokenNext.id) {
      return NextResponse.json({ ok: false, error: errorMessages.relogAcc }, { status: 400 })
    }

    // TODO: Separate it into a service to get the user data??
    const user = await UserModel.findById(tokenNext.id)
    if (!user) {
      return NextResponse.json({ ok: false, error: errorMessages.relogAcc }, { status: 400 })
    }

    // Fetch all categories and the user's categories from the database
    const allCategories = await CategoriesModel.find()
    const allCategoryNames = allCategories.map(cat => cat.name.toLowerCase())
    const allUserCategories = user.categories.map(id => id.toString())

    // Collect new and existing categories for the user
    const newUserCategories = new Set<string>()
    const existingUserCategories = new Set<string | number>()
    // Collect new and existing categories in general
    const newGeneralCategories = new Set<string>()
    const existingGeneralCategories = new Set<string | number>()

    transactions.forEach(trans => {
      trans.categories.forEach(category => {
        const lowerCaseName = category.name.toLowerCase()
        // for user categories
        if (category.newEntry && !allUserCategories.includes(lowerCaseName)) {
          newUserCategories.add(lowerCaseName)
        } else {
          existingUserCategories.add(category.id)
        }
        // for general categories
        if (allCategoryNames.includes(lowerCaseName)) {
          existingGeneralCategories.add(category.id)
        } else {
          newGeneralCategories.add(lowerCaseName)
        }
      })
    })

    console.log('newUserCategories', newUserCategories)
    console.log('existingUserCategories', existingUserCategories)
    console.log('newGeneralCategories', newGeneralCategories)
    console.log('existingGeneralCategories', existingGeneralCategories)

    // Insert new categories and get their IDs
    const newCategoryDocs = Array.from(newUserCategories).map(name => ({
      insertOne: {
        document: { name: capitalizeFirstLetter(name) }
      }
    }))
    // const bulkWriteResult = await CategoriesModel.bulkWrite(newCategoryDocs)
    // const newCategoryIds = Object.values(bulkWriteResult.insertedIds).map(
    //   id => new mongoose.Types.ObjectId(id as string)
    // )

    return NextResponse.json(
      { ok: true, insertedTransactions: transactions, updatedUser: user },
      { status: 201 }
    )
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : errorMessages.addingTransaction
    return NextResponse.json({ ok: true, error: errorMessage }, { status: 500 })
  }
}
