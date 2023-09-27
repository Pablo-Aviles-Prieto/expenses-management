import connectDb from '@/config/mongooseDB'
import { TransactionObjBack } from '@/interfaces/Transactions'
import TransactionModel from '@/models/transaction/TransactionModel'
import { errorMessages } from '@/utils/const'
import { isInvalidUserId } from '@/utils/isInvalidUserId'
import { cache } from 'react'

import '@/models/categories/CategoriesModel'

type TransactionsByDate = {
  userId: string
  startDate: string
  endDate: string
  transType: string | null
}

type QueryTransType = {
  userId: string
  date: { $gte: string; $lte: string }
  amount?: { $gte: number } | { $lt: number }
}

export const revalidate = 3600 // revalidate the data at most every hour
export const getAllTransactionsPerUser = cache(async (userId: string) => {
  if (isInvalidUserId(userId)) {
    throw new Error(errorMessages.invalidUserId)
  }

  await connectDb()
  const transactions = await TransactionModel.find({ userId })
    .sort({ date: -1 })
    .populate('categories')
  const parsedTransactions = JSON.parse(JSON.stringify(transactions)) as TransactionObjBack[]
  return { ok: true, transactions: parsedTransactions }
})

export const getTransactionsByDate = async ({
  userId,
  startDate,
  endDate,
  transType
}: TransactionsByDate) => {
  if (isInvalidUserId(userId)) {
    throw new Error(errorMessages.invalidUserId)
  }

  await connectDb()

  const query: QueryTransType = {
    userId,
    date: { $gte: startDate, $lte: endDate }
  }

  if (transType === 'incomes') {
    query.amount = { $gte: 0 }
  } else if (transType === 'expenses') {
    query.amount = { $lt: 0 }
  }
  const transactions = await TransactionModel.find(query).sort({ date: -1 }).populate('categories')

  const parsedTransactions = JSON.parse(JSON.stringify(transactions)) as TransactionObjBack[]
  return { ok: true, transactions: parsedTransactions }
}
