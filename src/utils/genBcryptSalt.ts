import { genSalt } from 'bcrypt'

const { BCRYPT_SALT } = process.env

export const bcryptSalt = async () => genSalt(+BCRYPT_SALT!)
