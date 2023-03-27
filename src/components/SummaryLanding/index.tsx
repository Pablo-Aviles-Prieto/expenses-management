import type { FC } from 'react'
import { SummaryCard } from '../styles'

export const SummaryLanding: FC = () => {
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
