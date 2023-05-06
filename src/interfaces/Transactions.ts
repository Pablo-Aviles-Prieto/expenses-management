import type { ObjectId } from 'mongoose'

export interface CategoryI {
  id: number | ObjectId
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
