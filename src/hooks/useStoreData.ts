import { TransactionObjBack } from '@/interfaces/Transactions'
import { create } from 'zustand'

interface StoreI {
  filteredTransactions: TransactionObjBack[]
  setFilteredTransactions: (filteredTransactions: TransactionObjBack[]) => void
  paginatedTransactions: TransactionObjBack[]
  setPâginatedTransactions: (filteredTransactions: TransactionObjBack[]) => void
}

export const useStoreData = create<StoreI>(set => {
  return {
    filteredTransactions: [],
    setFilteredTransactions: (filteredTransactions: TransactionObjBack[]) =>
      set({ filteredTransactions }),
    paginatedTransactions: [],
    setPâginatedTransactions: (paginatedTransactions: TransactionObjBack[]) =>
      set({ paginatedTransactions })
  }
})
