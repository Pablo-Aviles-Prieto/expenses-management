import { getCategoriesId } from '@/repository/categories'
import { getFilteredTransactions } from '@/repository/transaction'
import { errorMessages } from '@/utils/const'
import mongoose from 'mongoose'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (req: NextRequest) => {
  try {
    // TODO: Separate it into a service to get the user id??
    const tokenNext = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (
      !tokenNext ||
      !tokenNext.id ||
      typeof tokenNext.id !== 'string' ||
      !mongoose.Types.ObjectId.isValid(tokenNext.id)
    ) {
      return NextResponse.json({ ok: false, error: errorMessages.relogAcc }, { status: 400 })
    }

    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const transType = searchParams.get('transType')
    const filterType = searchParams.get('filterType')
    const filterOperator = searchParams.get('filterOperator')
    const filterValue = searchParams.get('filterValue')
    const filteredCategories = searchParams.get('categories')?.split(',')

    const categoriesId =
      filteredCategories && filteredCategories.length > 0
        ? await getCategoriesId({
            userId: tokenNext.id,
            categoriesNames: filteredCategories ?? []
          })
        : undefined

    return NextResponse.json(
      await getFilteredTransactions({
        userId: tokenNext.id,
        startDate: startDate ?? '',
        endDate: endDate ?? '',
        transType,
        filterType,
        filterOperator,
        filterValue,
        filteredCategories: categoriesId?.categories
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error('ERROR', error)
    return NextResponse.json({ ok: false, error: errorMessages.generic }, { status: 500 })
  }
}
