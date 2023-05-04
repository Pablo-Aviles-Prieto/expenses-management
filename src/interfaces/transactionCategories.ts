import type { ObjectId } from 'mongoose'

export interface CategoryI {
  id: number | ObjectId
  name: string
  newEntry?: boolean
}
