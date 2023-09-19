import { hash } from 'bcrypt'
import connectDb from '@/config/mongooseDB'
import UserModel from '@/models/user/UsersModel'
import { bcryptSalt } from '@/utils/genBcryptSalt'
import { errorMessages } from '@/utils/const'
import CategoriesModel from '@/models/categories/CategoriesModel'
import { NextRequest, NextResponse } from 'next/server'

type ReqObjI = {
  name: string
  email: string
  password: string
  image?: string
}

export const POST = async (req: NextRequest) => {
  const data = (await req.json()) as ReqObjI
  const { name, email, password, image } = data

  // TODO: improve error's
  if (!name || !email || !password) {
    return NextResponse.json({ ok: false, error: errorMessages.missingData }, { status: 400 })
  }

  try {
    await connectDb()

    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ ok: false, error: errorMessages.credentials }, { status: 400 })
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
    return NextResponse.json({ ok: true, createdUser: savedUser }, { status: 201 })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : errorMessages.createUser
    return NextResponse.json({ ok: false, error: errorMessage }, { status: 500 })
  }
}
