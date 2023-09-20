import connectDb from '@/config/mongooseDB'
import { TransactionObjBack } from '@/interfaces/Transactions'
import TransactionModel from '@/models/transaction/TransactionModel'
import { errorMessages } from '@/utils/const'
import { isInvalidUserId } from '@/utils/isInvalidUserId'

export const getAllTransactionsPerUser = async (userId: string) => {
  if (isInvalidUserId(userId)) {
    throw new Error(errorMessages.invalidUserId)
  }

  await connectDb()
  const transactions = await TransactionModel.find({ userId }).populate('categories')
  const parsedTransactions = JSON.parse(JSON.stringify(transactions)) as TransactionObjBack[]
  return { ok: true, transactions: parsedTransactions }
}
