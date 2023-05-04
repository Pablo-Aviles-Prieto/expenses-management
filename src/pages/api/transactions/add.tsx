import connectDb from '@/config/mongooseDB'
import { CategoryI } from '@/interfaces'
import { errorMessages } from '@/utils/const'
import { NextApiRequest, NextApiResponse } from 'next'
import CategoriesModel from '@/models/transactions/Categories'
import { ignoreCapsQuery } from '@/utils'

type ReqObjI = {
  categories: CategoryI[]
  creationDate: string
  date: string
  name: string
  notes?: string
}

const endpointController = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: errorMessages.methodAllowed })
    return
  }

  const { categories, creationDate, date, name, notes } = req.body as ReqObjI

  if (categories.length === 0 || !creationDate || !date || !name) {
    res.status(400).json({ error: errorMessages.missingData })
    return
  }

  // TODO: Categories should delete his own id, send it to the back, and when they are stored (the new categories,
  // in case there is new categories), get the id of the new categories to store the ID reference
  // in the user categories array

  try {
    await connectDb()
    const newCategories = categories.filter(category => category.newEntry)
    const categoriesToCreate = []

    // Can't use filter method since doesnt await the promise for each loop and yields true for each iteration
    for (const category of newCategories) {
      // eslint-disable-next-line no-await-in-loop
      const categoryExist = await CategoriesModel.findOne({
        name: ignoreCapsQuery(category.name)
      })
      if (!categoryExist) {
        categoriesToCreate.push(category)
      }
    }
    console.log('newCategories', newCategories)
    console.log('categoriesToCreate', categoriesToCreate)

    // TODO: Before creating a category I need to convert the string with the 1st letter
    // to upper case and the rest to lower case
    res.status(201).json({ result: 'TEST OK' })
  } catch (err) {
    // TODO: Set the error message into the global error obj => errorMessages
    const errorMessage = err instanceof Error ? err.message : 'Error adding the transaction to database'
    res.status(500).json({ error: errorMessage })
  }
}

export default endpointController
