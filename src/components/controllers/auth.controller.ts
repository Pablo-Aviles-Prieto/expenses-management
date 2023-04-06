// import type { NextApiResponse } from 'next'
// import { ExtendedRequest } from '@/interfaces'
// import { jwtTokenGenerator } from '../utils'
// import { UserModel } from '../models'
// import { compare } from 'bcryptjs'
// import { AuthError } from '../errors'

// export const loginUser = async (req: ExtendedRequest, res: NextApiResponse, next: NextFunction) => {
//   const { email, password } = req.body

//   try {
//     const userExist = await UserModel.findOne({ email }).exec()
//     if (!userExist) return next(new AuthError({ message: 'Check the credentials and try again!', status: 401 }))

//     const passwordMatches = await compare(password, userExist?.password)
//     if (!passwordMatches) return next(new AuthError({ message: 'Check the credentials and try again!', status: 401 }))

//     const parsedUserId = JSON.stringify(userExist._id)
//     const token = jwtTokenGenerator({ id: parsedUserId, email })
//     res.status(200).json({ token, user: userExist })
//   } catch (error) {
//     next(new AuthError({ message: 'Error while login user', status: 500 }))
//   }
// }
