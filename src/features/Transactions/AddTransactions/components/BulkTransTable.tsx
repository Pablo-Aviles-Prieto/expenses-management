'use client'

import { FC, useState } from 'react'
import { ComboboxField } from '@/components/Form'
import { CoinsStack } from '@/components/icons'
import { CategoryI } from '@/interfaces'
import { TransactionBulk } from '../interfaces/TransactionBulk'
import { TransactionListPagination } from '../../TransactionListPagination'

type Props = {
  bulkTransactions: TransactionBulk[]
  categoriesArray: CategoryI[]
}

const THEAD_CLASSES = 'bg-indigo-600 text-center p-2 border text-stone-100'
const ROW_CLASSES = 'text-center text-sm border p-2'

export const BulkTransTable: FC<Props> = ({ bulkTransactions, categoriesArray }) => {
  const [bulkPaginated, setBulkPaginate] = useState<TransactionBulk[]>([])
  const [currentOffset, setCurrentOffset] = useState<number>(0)

  const setPaginatedData = (data: unknown[]) => {
    setBulkPaginate(data as TransactionBulk[])
  }

  const getOffset = (offset: number) => {
    setCurrentOffset(offset)
  }

  return (
    <>
      <div className="w-full mt-2 border-gray-300">
        <table className="min-w-full border-collapse border-gray-300">
          <thead>
            <tr>
              <th className={`w-[16%] ${THEAD_CLASSES}`}>Date</th>
              <th className={`w-[9%] ${THEAD_CLASSES}`}>Amount</th>
              <th className={`w-[25%] ${THEAD_CLASSES}`}>Name (Concept)</th>
              <th className={`w-[5%] ${THEAD_CLASSES}`}>Notes</th>
              <th className={`w-[45%] ${THEAD_CLASSES}`}>Categories</th>
            </tr>
          </thead>
          <tbody>
            {bulkPaginated.map((transaction, i) => {
              return (
                <tr key={transaction.Concept + transaction.Date + i.toString()}>
                  <td className={`${ROW_CLASSES}`}>{transaction.Date}</td>
                  <td className={`!text-base ${ROW_CLASSES}`}>{transaction.Amount}</td>
                  <td className={`!text-left ${ROW_CLASSES}`}>{transaction.Concept}</td>
                  <td className={`!text-left ${ROW_CLASSES}`}>{transaction.Notes}</td>
                  <td className={`${ROW_CLASSES}`}>
                    <ComboboxField
                      id={`categories_${currentOffset + i}`}
                      name={`categories_${currentOffset + i}`}
                      label=""
                      dataArray={categoriesArray}
                      msgToCreateEntry={{ SVG: CoinsStack, message: 'Create this category' }}
                      displayErrorMsg={false}
                      displayOpenIcon={false}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <TransactionListPagination
        rawTransactions={bulkTransactions}
        setTransPaginated={setPaginatedData}
        getOffset={getOffset}
      />
    </>
  )
}
