import { CategoryI, TransactionObjI } from '@/interfaces'

export function isValidTransaction(transaction: unknown): transaction is TransactionObjI {
  if (typeof transaction !== 'object' || transaction === null) {
    return false
  }

  const { name, amount, date, creationDate, categories, notes } =
    transaction as Partial<TransactionObjI>

  return (
    typeof name === 'string' &&
    typeof amount === 'number' &&
    typeof date === 'string' &&
    typeof creationDate === 'string' &&
    Array.isArray(categories) &&
    categories.every((category: unknown) => {
      if (typeof category !== 'object' || category === null) {
        return false
      }

      const { id, name: catName, newEntry } = category as Partial<CategoryI>

      return (
        typeof id !== 'undefined' &&
        typeof catName === 'string' &&
        (typeof newEntry === 'undefined' || typeof newEntry === 'boolean')
      )
    }) &&
    (typeof notes === 'undefined' || typeof notes === 'string')
  )
}
