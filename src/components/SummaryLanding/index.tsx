'use client'

import { useEffect, type FC } from 'react'
import { useCustomToast } from '@/hooks'
import { SummaryCard } from '../styles'

type Props = {
  hasError: string | null
}

// TODO: Convert it into the main user profile page
// also adds top 3 categories in incomes and expenses, and some options
// to filter the data to discover in which days/categories/months the user
// expends more money, or in which category/month is the largest purchase in
// the last year
export const SummaryLanding: FC<Props> = ({ hasError }) => {
  const { showToast } = useCustomToast()

  useEffect(() => {
    if (hasError) {
      showToast({
        msg: hasError,
        options: { type: 'error' }
      })
    }
  }, [hasError])

  return (
    <div className="flex justify-between gap-6">
      <SummaryCard type="incomes">
        <p>Incomes this month</p>
      </SummaryCard>
      <SummaryCard type="expenses">
        <p>Expenses this month</p>
      </SummaryCard>
      <SummaryCard type="balance">
        <p>Balance this month</p>
      </SummaryCard>
    </div>
  )
}
