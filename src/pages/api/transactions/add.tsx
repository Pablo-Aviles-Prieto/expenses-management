/* eslint-disable no-await-in-loop */
import connectDb from '@/config/mongooseDB'
import { ResponseTransactionI } from '@/interfaces'
import { errorMessages } from '@/utils/const'
import { NextApiRequest, NextApiResponse } from 'next'
import CategoriesModel from '@/models/categories/CategoriesModel'
import { capitalizeFirstLetter, ignoreCapsQuery, isValidTransaction } from '@/utils'
import UserModel from '@/models/user/UserModel'
import { getToken } from 'next-auth/jwt'
import mongoose from 'mongoose'

interface ReqObjI {
  transactions: ResponseTransactionI
}

const endpointController = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: errorMessages.methodAllowed })
    return
  }

  const { transactions } = req.body as ReqObjI

  if (transactions.length === 0 || !transactions.every(isValidTransaction)) {
    // TODO: update error message to missing or malformed data
    res.status(400).json({ error: errorMessages.missingData })
    return
  }

  try {
    await connectDb()
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
        const createdCategory = await new CategoriesModel({ name: capitalizeFirstLetter(category.name) }).save()
        categoryId = createdCategory._id
      }
      addCategoriesToUser.push(categoryId)
    }

    // All the categories that has to be added to the transaction (after looping through newCategories)
    const addCategoriesToTransaction = [...existingCategories, ...addCategoriesToUser]

    // Follow this approach instead the session!
    const tokenNext = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!tokenNext || !tokenNext.id) {
      res.status(400).json({ error: ' There is an error fetching the user data. Try again later' })
      return
    }

    // Separate it into a service to get the user data??
    const user = await UserModel.findById(tokenNext.id)
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    if (addCategoriesToUser.length > 0) {
      // Add all the categories that are not included in the user.categories
      addCategoriesToUser.forEach(categoryId => {
        if (!user.categories.includes(categoryId)) {
          user.categories.push(categoryId)
        }
      })
      await user.save()
    }

    console.log('newCategories', newCategories)
    console.log('addCategoriesToUser', addCategoriesToUser)
    console.log('addCategoriesToTransaction', addCategoriesToTransaction)

    // TODO: need to save the transaction with the correct category objectIds (since all the
    // new categories that came from the front, doesnt have the IDs). The best way is to create the array with
    // the objectids, the categories without newEntry prop has the id as objectid, the others objectIds,
    // are stored in the categoriesToAdd

    // TODO: Use the inserMany to insert an array of transactions
    // TODO: The transactions has to have the addCategoriesToTransaction array per every object that
    // is in the transaction. Check what happens if notes is not sent
    res.status(201).json({ result: 'TEST OK' })
  } catch (err) {
    // TODO: Set the error message into the global error obj => errorMessages
    const errorMessage = err instanceof Error ? err.message : 'Error adding the transaction to database'
    res.status(500).json({ error: errorMessage })
  }
}

export default endpointController
