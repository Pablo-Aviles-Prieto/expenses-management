/* eslint-disable max-len */

import { TransactionObjBack } from '@/interfaces/Transactions'
import { FC } from 'react'
import { CardContainer } from '@/components/styles/CardContainer'
import { CustomPopover } from '@/components/styles/Popover/CustomPopover'

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

export const TransactionList: FC<PropsI> = ({ transResponse }) => {
  if (!transResponse.transactions || transResponse.transactions?.length === 0) {
    return <div>There are no transactions yet! Lets make some investments</div>
  }

  return (
    <>
      <CardContainer containerWidth="full">
        <p>Chart section</p>
      </CardContainer>
      <CardContainer containerWidth="full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">Transactions:</h3>
          <div>Filter inputs</div>
        </div>
        <div className={`overflow-hidden border rounded-lg ${TABLE_BORDER_COLOR}`}>
          <div
            className={`flex items-center py-2 bg-indigo-700 border-b ${TABLE_PADDING_X} ${TABLE_BORDER_COLOR}`}
          >
            <p className="w-4/12">Name</p>
            <p className="w-2/12">Amount</p>
            <p className="w-2/12">Date</p>
            <p className="w-2/12">Categories</p>
            <p className="w-2/12">Notes</p>
            <p className="w-2/12">Actions</p>
          </div>
          <ul>
            {transResponse.transactions.map((trans, i) => {
              const isLastItem = transResponse.transactions
                ? i === transResponse.transactions.length - 1
                : false
              return (
                <li
                  className={`flex items-center py-4 hover:bg-indigo-900 ${TABLE_PADDING_X} 
									${isLastItem ? 'border-0' : 'border-b'} ${TABLE_BORDER_COLOR}`}
                  key={`${trans.createdAt} + ${trans.amount}`}
                >
                  <p className="w-4/12">{trans.name}</p>
                  <p className="w-2/12">{trans.amount}</p>
                  <p className="w-2/12">{trans.date}</p>
                  <p className="w-2/12">{trans.categories.map(cat => cat.name).join(' ')}</p>
                  <p className="w-2/12">
                    {trans.notes ? trans.notes : 'There are no comments for this transaction'}
                  </p>
                  <p className="w-2/12">Buttons</p>
                </li>
              )
            })}
          </ul>
        </div>
      </CardContainer>
      <CardContainer containerWidth="full">
        <CustomPopover buttonValue="Categories" />
      </CardContainer>
    </>
  )
}
