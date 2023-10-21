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
  categories: CategoryI[]
  notes?: string
}

export type TransactionObjBack = TransactionObjI & {
  userId: string
  createdAt: string
  updatedAt: string
}

export interface ResponseTransactionI {
  ok: boolean
  error?: string
  insertedTransactions?: TransactionObjBack[]
  updatedUser?: UserI[]
}

export interface ResponseTransactionBulkI {
  ok: boolean
  error?: string
  insertedTransactions?: number
  updatedUser?: UserI[]
}
