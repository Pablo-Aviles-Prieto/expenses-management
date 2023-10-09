import { FC } from 'react'
import { TransactionBulk } from '../interfaces/TransactionBulk'

type Props = {
  bulkTransactions: TransactionBulk[]
}

export const BulkTransTable: FC<Props> = ({ bulkTransactions }) => {
  return (
    <div className="w-full mt-4 max-h-[20rem] overflow-y-auto">
      <h4 className="text-lg font-bold">Transaction list</h4>
      <ul>
        {bulkTransactions.map((transaction, i) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <li key={transaction.Concept + i.toString()}>
              <span>Date: {transaction.Date}</span>
              <span>Amount: {transaction.Amount}</span>
              <span>Concept: {transaction.Concept}</span>
              <span>Notes: {transaction.Notes}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
