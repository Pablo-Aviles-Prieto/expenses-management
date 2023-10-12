/* eslint-disable max-len */
import { FC } from 'react'
import { ComboboxField } from '@/components/Form'
import { CoinsStack } from '@/components/icons'
import { CategoryI } from '@/interfaces'
import { TransactionBulk } from '../interfaces/TransactionBulk'

type Props = {
  bulkTransactions: TransactionBulk[]
  categoriesArray: CategoryI[]
}

const THEAD_CLASSES = 'bg-indigo-600 text-center p-2 border text-stone-100'
const ROW_CLASSES = 'text-center text-base border p-2'

export const BulkTransTable: FC<Props> = ({ bulkTransactions, categoriesArray }) => {
  return (
    <>
      <h4 className="text-lg font-bold">Transaction list</h4>
      <div className="w-full mt-4 max-h-[22rem] overflow-y-auto">
        <table className="min-w-full border-collapse border-gray-300">
          <thead className="sticky -top-[1px]">
            <tr>
              <th className={`w-[18%] ${THEAD_CLASSES}`}>Date</th>
              <th className={`w-[10%] ${THEAD_CLASSES}`}>Amount</th>
              <th className={`w-[40%] ${THEAD_CLASSES}`}>Name (Concept)</th>
              <th className={`w-[15%] ${THEAD_CLASSES}`}>Notes</th>
              <th className={`w-[15%] ${THEAD_CLASSES}`}>Categories</th>
            </tr>
          </thead>
          <tbody>
            {bulkTransactions.map((transaction, i) => {
              return (
                <tr key={transaction.Concept + transaction.Date + i.toString()}>
                  <td className={`${ROW_CLASSES}`}>{transaction.Date}</td>
                  <td className={`${ROW_CLASSES}`}>{transaction.Amount}</td>
                  <td className={`text-sm !text-left ${ROW_CLASSES}`}>{transaction.Concept}</td>
                  <td className={`text-sm !text-left ${ROW_CLASSES}`}>{transaction.Notes}</td>
                  <td className={`${ROW_CLASSES}`}>
                    <ComboboxField
                      id={`categories_${i}`}
                      name={`categories_${i}`}
                      label="Categories"
                      dataArray={[...categoriesArray]}
                      msgToCreateEntry={{ SVG: CoinsStack, message: 'Create this category' }}
                      subTitle="Select from the pre-defined or your saved categories, or just create a new one"
                      isRequired
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
