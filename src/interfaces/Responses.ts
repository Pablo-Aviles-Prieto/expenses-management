import { CategoriesI } from './Categories'

export interface ResponseUserI {
  email: string
  id: string
  name: string
  image: string
  signupDate: string
  categories: CategoriesI
}
