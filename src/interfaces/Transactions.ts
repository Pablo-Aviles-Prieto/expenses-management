// import type { ObjectId } from 'mongoose'

// TODO: The category id is a number (when created) and a string of the ObjectId
// since it comes populated, and it returns a id as string, not as ObjectId. SHOULD BE CHANGED
export interface CategoryI {
  id: number | string
  name: string
  newEntry?: boolean
}

export interface TransactionObjI {
  name: string
  amount: number
  date: string
  creationDate: string
  categories: CategoryI[]
  notes?: string
}

export type ResponseTransactionI = TransactionObjI[]
