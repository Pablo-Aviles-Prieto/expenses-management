/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
import connectDb from '@/config/mongooseDB'
import { TransactionObjI } from '@/interfaces'
import { errorMessages } from '@/utils/const'
import CategoriesModel from '@/models/categories/CategoriesModel'
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter'
import { ignoreCapsQuery } from '@/utils/mongoose'
import { isValidTransaction } from '@/utils/isValidTransaction'
import UserModel from '@/models/user/UsersModel'
import { getToken } from 'next-auth/jwt'
import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import TransactionModel from '@/models/transaction/TransactionModel'

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

    // We just pass the 1st transaction since all of'em have the same categories
    // All the categories with the newEntry flag
    const newCategories = transactions[0].categories.filter(category => category.newEntry)
    // All the new categories for the user, that has to be added
    const addCategoriesToUser: mongoose.Schema.Types.ObjectId[] = []
    // All the categories that the user already has stored
    const existingCategories = transactions[0].categories
      .filter(category => !category.newEntry && typeof category.id !== 'number')
      .map(category => new mongoose.Types.ObjectId(category.id))

    // Can't use filter method since doesnt await the promise for each loop and yields true for each iteration
    for (const category of newCategories) {
      const categoryExist = await CategoriesModel.findOne({
        name: ignoreCapsQuery(category.name)
      })

      let categoryId
      if (categoryExist) {
        categoryId = categoryExist._id
      } else {
        const createdCategory = await new CategoriesModel({
          name: capitalizeFirstLetter(category.name)
        }).save()
        categoryId = createdCategory._id
      }
      addCategoriesToUser.push(categoryId)
    }

    // All the categories that has to be added to the transaction (after looping through newCategories)
    const addCategoriesToTransaction = [...existingCategories, ...addCategoriesToUser]

    let updatedUser
    if (addCategoriesToUser.length > 0) {
      // $addToSet only adds unique items to an array.
      updatedUser = await UserModel.findByIdAndUpdate(
        tokenNext.id,
        {
          $addToSet: { categories: { $each: addCategoriesToUser } }
        },
        { new: true }
      )
    }

    console.log('user._id ', user._id)
    const transactionDocs = transactions.map(trans => {
      const { categories, ...restTrans } = trans
      return { ...restTrans, categories: addCategoriesToTransaction, userId: user._id }
    })
    console.log('transactionDocs', transactionDocs)
    const insertedTransactions = await TransactionModel.insertMany(transactionDocs)

    // TODO: Check what happens if notes is not sent

    // returning the updatedUser (in case that his categories was updated) if not the user
    return NextResponse.json(
      { ok: true, insertedTransactions, updatedUser: updatedUser ?? user },
      { status: 201 }
    )
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : errorMessages.addingTransaction
    return NextResponse.json({ ok: true, error: errorMessage }, { status: 500 })
  }
}
