import type { NextApiRequest, NextApiResponse } from 'next'
import { hash, genSalt } from 'bcrypt'
import connectDb from '@/config/mongooseDB'
import UserModel from '@/models/user/UserModel'

type ReqObjI = {
  name: string
  email: string
  password: string
}

const { BCRYPT_SALT } = process.env

const endpointController = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  const { name, email, password } = req.body as ReqObjI

  // TODO: improve error
  if (!name || !email || !password) throw new Error('Fill all the inputs')

  try {
    await connectDb()

    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      res.status(400).json({ error: 'Email already in use' })
      return
    }

    const salt = await genSalt(+BCRYPT_SALT!)
    const hashedPassword = await hash(password, salt)

    const newUser = new UserModel({
      image: 'default-photo-url', // replace with actual photo URL or logic
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
