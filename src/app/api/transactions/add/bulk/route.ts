import connectDb from '@/config/mongooseDB'
import { TransactionObjI } from '@/interfaces'
import { errorMessages } from '@/utils/const'
import { isValidTransaction } from '@/utils/isValidTransaction'
import UserModel from '@/models/user/UsersModel'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

interface ReqObjI {
  transactions: TransactionObjI[]
}

export const POST = async (req: NextRequest) => {
  const data = (await req.json()) as ReqObjI
  const { transactions } = data

  if (transactions.length === 0 || !transactions.every(isValidTransaction)) {
    return NextResponse.json({ ok: false, error: errorMessages.missingData }, { status: 400 })
  }

  try {
    await connectDb()

    // TODO: Separate it into a service to get the user id??
    const tokenNext = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!tokenNext || !tokenNext.id) {
      return NextResponse.json({ ok: false, error: errorMessages.relogAcc }, { status: 400 })
    }

    // TODO: Separate it into a service to get the user data??
    const user = await UserModel.findById(tokenNext.id)
    if (!user) {
      return NextResponse.json({ ok: false, error: errorMessages.relogAcc }, { status: 400 })
    }

    console.log('transactions', transactions)

    return NextResponse.json(
      { ok: true, insertedTransactions: transactions, updatedUser: user },
      { status: 201 }
    )
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : errorMessages.addingTransaction
    return NextResponse.json({ ok: true, error: errorMessage }, { status: 500 })
  }
}
