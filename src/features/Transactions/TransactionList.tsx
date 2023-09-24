/* eslint-disable max-len */

import { CategoryI, TransactionObjBack } from '@/interfaces/Transactions'
import { FC } from 'react'
import { CardContainer } from '@/components/styles/CardContainer'
import { CustomPopover } from '@/components/styles/Popover/CustomPopover'
import { TransactionListActions } from './TransactionListActions'

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

export const TransactionList: FC<PropsI> = ({ transResponse }) => {
  // TODO: Every 3 or 4 categories, render it in a new line
  const renderTransactionsList = (transactions: TransactionObjBack[]) => {
    const renderCategories = (categories: CategoryI[]) => {
      return (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map(cat => {
            return (
              <div key={cat.id} className="px-6 py-2 bg-indigo-700 rounded-full">
                {cat.name}
              </div>
            )
          })}
        </div>
      )
    }

    const renderNotes = (notes?: string) => {
      return <div className="w-full">{notes ?? 'There are no comments for this transaction'}</div>
    }

    return (
      <ul>
        {transactions.map((trans, i) => {
          const isLastItem = i === transactions.length - 1
          return (
            <li
              className={`flex text-lg items-center py-4 hover:bg-indigo-900 ${TABLE_PADDING_X} 
					${isLastItem ? 'border-0' : 'border-b'} ${TABLE_BORDER_COLOR}`}
              key={`${trans.createdAt} + ${trans.amount}`}
            >
              <div className={`${NAME_CELL_CLASSES}`}>{trans.name}</div>
              <div
                className={`${AMOUNT_CELL_CLASSES} ${
                  trans.amount > 0 ? 'text-green-500' : 'text-red-500'
                } font-bold text-xl`}
              >
                {trans.amount}
              </div>
              <div className={`${DATE_CELL_CLASSES}`}>{trans.date}</div>
              <div className={`${CATEGORIES_CELL_CLASSES}`}>
                <CustomPopover
                  buttonValue="Categories"
                  panelContent={renderCategories(trans.categories)}
                  panelWidth="max-w-xs w-[550px]"
                />
              </div>
              <div className={`${NOTES_CELL_CLASSES} max-auto`}>
                <CustomPopover
                  buttonValue="Notes"
                  panelContent={renderNotes(trans.notes)}
                  panelWidth="max-w-xs w-[550x]"
                />
              </div>
              <div className={`${ACTIONS_CELL_CLASSES} flex items-center justify-center gap-4`}>
                <TransactionListActions />
              </div>
            </li>
          )
        })}
      </ul>
    )
  }

  if (!transResponse.transactions || transResponse.transactions?.length === 0) {
    return <div>There are no transactions yet! Lets make some investments</div>
  }

  return (
    <>
      <CardContainer containerWidth="full">
        <div className="mb-4">Filters</div>
        <p>Chart section</p>
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
          {renderTransactionsList(transResponse.transactions)}
        </div>
      </CardContainer>
    </>
  )
}
