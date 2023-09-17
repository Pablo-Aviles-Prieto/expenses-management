import { CategoriesI } from './Categories'

export interface ResponseUserI {
  ok: boolean
  error?: string
  createdUser?: UserI
}

export interface UserI {
  email: string
  id: string
  name: string
  image: string
  signupDate: string
  categories: CategoriesI
}
