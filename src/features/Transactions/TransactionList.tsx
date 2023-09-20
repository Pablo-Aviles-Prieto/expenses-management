'use client'

import { TransactionObjBack } from '@/interfaces/Transactions'
import { FC } from 'react'

type ResponseI = {
  ok: boolean
  transactions?: TransactionObjBack[]
  error?: string
}

type PropsI = {
  transResponse: ResponseI
}

export const TransactionList: FC<PropsI> = ({ transResponse }) => {
  if (!transResponse.transactions || transResponse.transactions?.length === 0) {
    return <div>There are no transactions yet! Lets invest a bit</div>
  }

  return (
    <div>
      <h3 className="text-lg font-bold">Transaction list:</h3>
      {transResponse.transactions.map(trans => {
        return (
          <ul className="py-4" key={`${trans.createdAt} + ${trans.amount}`}>
            <li>
              <p>Name: {trans.name}</p>
              <p>Amount: {trans.amount}</p>
              <p>Categories: {trans.categories.map(cat => cat.name).join(' ')}</p>
              <p>Date: {trans.date}</p>
              <p>Date of creation: {trans.createdAt}</p>
              <p>
                Notes: {trans.notes ? trans.notes : 'There are no comments for this transaction'}
              </p>
            </li>
          </ul>
        )
      })}
    </div>
  )
}
