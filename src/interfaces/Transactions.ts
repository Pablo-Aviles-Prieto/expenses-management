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
