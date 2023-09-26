/* eslint-disable max-len */

import { CategoryI, TransactionObjBack } from '@/interfaces/Transactions'
import { FC } from 'react'
import { CustomPopover } from '@/components/styles/Popover/CustomPopover'
import { Spinner } from '@/components/styles'
import { TransactionListActions } from './TransactionListActions'
import { RenderFormattedDate } from './RenderFormattedDate'

type PropsI = {
  transactions: TransactionObjBack[]
  isFilteringData: boolean
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
export const TransactionList: FC<PropsI> = ({ transactions, isFilteringData }) => {
  const renderCategories = (categories: CategoryI[]) => {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map(cat => {
          return (
            <div key={cat.id} className="px-6 py-1 text-base bg-indigo-700 rounded-full">
              {cat.name}
            </div>
          )
        })}
      </div>
    )
  }

  const renderNotes = (notes?: string) => {
    // If notes is falsy, the button is disabled, so it shouldnt show the empty string
    return <div className="text-center text-slate-200 min-w-min">{notes ?? ''}</div>
  }

  return (
    <div>
      {isFilteringData ? (
        <div className="flex items-center justify-center my-16">
          <Spinner size="xl" classes="border-violet-400 w-14 h-14" />
        </div>
      ) : (
        <ul>
          {transactions.map((trans, i) => {
            const isLastItem = i === transactions.length - 1
            return (
              <li
                className={`flex text-base items-center py-2 hover:bg-indigo-900 ${TABLE_PADDING_X} 
				  			${isLastItem ? 'border-0 hover:rounded-b-lg' : 'border-b'} ${TABLE_BORDER_COLOR}`}
                key={`${trans.createdAt} + ${trans.date} + ${trans.amount}`}
              >
                <div className={`${NAME_CELL_CLASSES} text-lg`}>{trans.name}</div>
                <div
                  className={`${AMOUNT_CELL_CLASSES} ${
                    trans.amount > 0 ? 'text-green-500' : 'text-red-500'
                  } font-bold text-lg`}
                >
                  {trans.amount}
                </div>
                <div className={`${DATE_CELL_CLASSES}`}>
                  <RenderFormattedDate stringDate={trans.date} />
                </div>
                <div className={`${CATEGORIES_CELL_CLASSES}`}>
                  <CustomPopover
                    buttonValue="Categories"
                    panelContent={renderCategories(trans.categories)}
                    panelWidth="max-w-xs"
                  />
                </div>
                <div className={`${NOTES_CELL_CLASSES} max-auto`}>
                  <CustomPopover
                    buttonValue="Notes"
                    panelContent={renderNotes(trans.notes)}
                    panelWidth="max-w-sm"
                    isDisabled={!trans.notes}
                  />
                </div>
                <div className={`${ACTIONS_CELL_CLASSES} flex items-center justify-center gap-4`}>
                  <TransactionListActions />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
