import type { NextApiRequest, NextApiResponse } from 'next'
import { hash } from 'bcrypt'
import connectDb from '@/config/mongooseDB'
import UserModel from '@/models/user/UsersModel'
import { bcryptSalt } from '@/utils/genBcryptSalt'
import { errorMessages } from '@/utils/const'
import CategoriesModel from '@/models/categories/CategoriesModel'

type ReqObjI = {
  name: string
  email: string
  password: string
  image?: string
}

const endpointController = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: errorMessages.methodAllowed })
    return
  }

  const { name, email, password, image } = req.body as ReqObjI

  // TODO: improve error's
  if (!name || !email || !password) {
    res.status(400).json({ error: errorMessages.missingData })
    return
  }

  try {
    await connectDb()

    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      res.status(400).json({ error: errorMessages.emailRegistered })
      return
    }

    const salt = await bcryptSalt()
    const hashedPassword = await hash(password, salt)

    const getCategories = await CategoriesModel.find({ common: true })
    const commonCategories = getCategories.map(category => category._id)

    // TODO: Change hardcoded path to default avatar
    const newUser = new UserModel({
      image: image || 'http://localhost:3000/images/default-avatar.jpg',
      name,
      email,
      password: hashedPassword,
      signupDate: new Date().toISOString(),
      categories: commonCategories
    })

    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : errorMessages.createUser
    res.status(500).json({ error: errorMessage })
  }
}

export default endpointController
