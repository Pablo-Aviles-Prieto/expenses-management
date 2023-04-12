import type { NextApiRequest, NextApiResponse } from 'next'
import { hash } from 'bcrypt'
import connectDb from '@/config/mongooseDB'
import UserModel from '@/models/user/UserModel'
import { bcryptSalt } from '@/utils/genBcryptSalt'

type ReqObjI = {
  name: string
  email: string
  password: string
  image?: string
}

const endpointController = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  const { name, email, password, image } = req.body as ReqObjI

  // TODO: improve error's
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Missing data to handle register' })
    return
  }

  try {
    await connectDb()

    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      res.status(400).json({ error: 'Email already in use' })
      return
    }

    const salt = await bcryptSalt()
    const hashedPassword = await hash(password, salt)

    const newUser = new UserModel({
      image: image || 'http://localhost:3000/images/default-avatar.jpg',
      name,
      email,
      password: hashedPassword,
      signupDate: new Date().toISOString()
    })

    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Error creating the user'
    res.status(500).json({ error: errorMessage })
  }
}

export default endpointController
