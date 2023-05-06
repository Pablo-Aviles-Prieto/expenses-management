/* eslint-disable no-await-in-loop */
import connectDb from '@/config/mongooseDB'
import { CustomSessionI, ResponseTransactionI } from '@/interfaces'
import { errorMessages } from '@/utils/const'
import { NextApiRequest, NextApiResponse } from 'next'
import CategoriesModel from '@/models/transactions/CategoriesModel'
import { capitalizeFirstLetter, ignoreCapsQuery, isValidTransaction } from '@/utils'
import { getSession } from 'next-auth/react'
import UserModel from '@/models/user/UserModel'
import { getToken } from 'next-auth/jwt'

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
    const newCategories = transactions[0].categories.filter(category => category.newEntry)
    const categoriesToAdd = []

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
      categoriesToAdd.push(categoryId)
    }

    // Follow this approach
    const tokenNext = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    console.log('tokenNext', tokenNext)

    // Separate it into a service to get the session of the user??
    const session = (await getSession({ req })) as CustomSessionI | null
    console.log('session', session)

    if (!session || !session.user?.id) {
      res.status(400).json({ error: ' There is an error fetching the user data. Try again later' })
      return
    }

    // Separate it into a service to get the user data??
    const user = await UserModel.findById(session.user.id)
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    // Add all the categories that are not included in the user.categories
    categoriesToAdd.forEach(categoryId => {
      if (!user.categories.includes(categoryId)) {
        user.categories.push(categoryId)
      }
    })
    await user.save()
    console.log('newCategories', newCategories)
    console.log('categoriesToAdd', categoriesToAdd)

    // TODO: need to save the transaction with the correct category objectIds (since all the
    // new categories that came from the front, doesnt have the IDs). The best way is to create the array with
    // the objectids, the categories without newEntry prop has the id as objectid, the others objectIds,
    // are stored in the categoriesToAdd
    res.status(201).json({ result: 'TEST OK' })
  } catch (err) {
    // TODO: Set the error message into the global error obj => errorMessages
    const errorMessage = err instanceof Error ? err.message : 'Error adding the transaction to database'
    res.status(500).json({ error: errorMessage })
  }
}

export default endpointController
