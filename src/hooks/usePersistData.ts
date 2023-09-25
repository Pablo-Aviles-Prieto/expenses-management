'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PersistStoreI {
  transactionStartDate: Date | null
  transactionEndDate: Date | null
  setTransactionStartDate: (date: Date | null) => void
  setTransactionEndDate: (date: Date | null) => void
}

export const usePersistData = create<PersistStoreI>()(
  persist(
    set => ({
      transactionStartDate: null,
      setTransactionStartDate: (date: Date | null) => set({ transactionStartDate: date }),
      transactionEndDate: null,
      setTransactionEndDate: (date: Date | null) => set({ transactionEndDate: date })
    }),
    {
      name: 'selected-transactions-dates',
      storage: {
        getItem: name => {
          const str = localStorage.getItem(name)
          console.log('str', str)
          if (!str) return null
          const { state }: { state: Partial<PersistStoreI> } = JSON.parse(str) as {
            state: Partial<PersistStoreI>
          }
          console.log('state', state)

          // Convert ISO strings to Date objects
          return {
            state: {
              ...state,
              transactionStartDate: state.transactionStartDate
                ? new Date(state.transactionStartDate)
                : null,
              transactionEndDate: state.transactionEndDate
                ? new Date(state.transactionEndDate)
                : null
            }
          }
        },
        setItem: (name, newValue) => {
          const str = JSON.stringify({
            state: {
              ...newValue.state
            }
          })
          localStorage.setItem(name, str)
        },
        removeItem: name => {
          localStorage.removeItem(name)
        }
      }
    }
  )
)
