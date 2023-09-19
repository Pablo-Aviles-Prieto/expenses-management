import { UserI } from './User'

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

type TransactionObjBack = TransactionObjI & { userId: string }

export interface ResponseTransactionI {
  ok: boolean
  error?: string
  insertedTransactions?: TransactionObjBack[]
  updatedUser?: UserI[]
}
