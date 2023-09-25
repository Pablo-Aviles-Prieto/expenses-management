/* eslint-disable max-len */

import { TransactionObjBack } from '@/interfaces/Transactions'
import { FC } from 'react'
import { CardContainer } from '@/components/styles/CardContainer'
import { TransactionListPagination } from './TransactionListPagination'
import LineChart from './LineChart'
import { TransactionList } from './TransactionList'

type ResponseI = {
  ok: boolean
  transactions?: TransactionObjBack[]
  error?: string
}

type PropsI = {
  transResponse: ResponseI
}

const TABLE_BORDER_COLOR = 'border-gray-500'
const TABLE_PADDING_X = 'px-2'
const NAME_CELL_CLASSES = 'w-4/12'
const AMOUNT_CELL_CLASSES = 'w-2/12 text-center'
const DATE_CELL_CLASSES = 'w-2/12 text-center'
const CATEGORIES_CELL_CLASSES = 'w-2/12 text-center'
const NOTES_CELL_CLASSES = 'w-2/12 text-center'
const ACTIONS_CELL_CLASSES = 'w-2/12 text-center'

// TODO: Limit the number of chars showed for the name. Use a function showing ellipsis.
// Also do the same for the notes, limit the length of the characters whogin on the Popover
export const Transactions: FC<PropsI> = ({ transResponse }) => {
  if (!transResponse.transactions || transResponse.transactions?.length === 0) {
    return <div>There are no transactions yet! Lets make some investments</div>
  }

  return (
    <>
      <CardContainer containerWidth="full">
        {/* TODO: only needs data filtered from dates and if is filtering by incomes/expenses 
				(showing the stacked categories for the incomes or expenses selected) 
				USE THE useStoreData => filteredTransactions prop */}
        <LineChart transactions={transResponse.transactions} />
      </CardContainer>
      <CardContainer containerWidth="full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">Transactions:</h3>
          <div>Filter inputs</div>
        </div>
        <div className={`border rounded-lg ${TABLE_BORDER_COLOR}`}>
          <div
            className={`font-bold text-xl flex items-center py-2 bg-indigo-700 rounded-t-lg border-b ${TABLE_PADDING_X} ${TABLE_BORDER_COLOR}`}
          >
            <div className={`${NAME_CELL_CLASSES}`}>Name</div>
            <div className={`${AMOUNT_CELL_CLASSES}`}>Amount</div>
            <div className={`${DATE_CELL_CLASSES}`}>Date</div>
            <div className={`${CATEGORIES_CELL_CLASSES}`}>Categories</div>
            <div className={`${NOTES_CELL_CLASSES}`}>Notes</div>
            <div className={`${ACTIONS_CELL_CLASSES}`}>Actions</div>
          </div>
          {/* TODO: it needs the paginatedTransactions from useStoreData
					being filtered by name, if its greater or lower than a concrete number and 
					if its showing a concrete or all the categories in the multiple dropdown */}
          <TransactionList transactions={transResponse.transactions} />
        </div>
        <TransactionListPagination transactions={transResponse.transactions} />
      </CardContainer>
    </>
  )
}
