'use client'

import { TransactionObjBack } from '@/interfaces/Transactions'
import { dateFormat } from '@/utils/const'
import { format } from 'date-fns'
import { useDateFormat } from '@/hooks/useDateFormat'
import { getDaysOfInterval } from '../utils/getDaysOfInterval'
import { Dataset, LineChartData } from '../interfaces'

type GenerateDatasetParams = {
  transArray: TransactionObjBack[]
  label: string
}

type Params = {
  transactions: TransactionObjBack[]
  periodInterval: { start: string; end: string }
  transFilterType: string // 'All transactions', 'Incomes', 'Expenses'
}

const RED_COLOR = '#e00000'

export const useTransactionsChartData = () => {
  const { dateFormatSelected } = useDateFormat()

  const parseChartData = ({ transactions, periodInterval, transFilterType }: Params) => {
    // TODO: Check the length of datesInterval since the user could ask
    // for a long period of time, but it doesnt have much data.
    // In case that it has several dates and in different months (min and max date)
    // display a monthly view instead of daily
    // TODO: In case that its an income or expense, should display the stacked data of
    // the categories!
    if (transactions.length === 0) {
      return {
        transactionsChartData: {
          labels: [],
          datasets: []
        },
        highestAmount: 0
      }
    }

    const incomesTrans = transactions.filter(trans => trans.amount >= 0)
    const expensesTrans = transactions.filter(trans => trans.amount < 0)

    const datesInterval = getDaysOfInterval({
      startDate: periodInterval.start,
      endDate: periodInterval.end,
      stringFormatReturned: dateFormat.ISO
    })

    const generateDataset = ({ transArray, label }: GenerateDatasetParams): Dataset => {
      const data = datesInterval.map(date => {
        const transactionsOnThisDate = transArray.filter(trans => trans.date === date)
        const sum = transactionsOnThisDate.reduce((acc, curr) => acc + curr.amount, 0)
        return Math.abs(sum)
      })

      return {
        label: `${label}`,
        data,
        rawData: [...data],
        backgroundColor: label === 'Incomes' ? 'green' : RED_COLOR,
        borderColor: label === 'Incomes' ? 'green' : RED_COLOR
      }
    }

    const expensesDataset = generateDataset({ transArray: expensesTrans, label: 'Expenses' })
    const incomesDataset = generateDataset({ transArray: incomesTrans, label: 'Incomes' })

    const highestAmount = Math.max(...expensesDataset.data, ...incomesDataset.data)

    const transactionsChartData: LineChartData = {
      labels: datesInterval.map(date => format(new Date(date), dateFormatSelected)),
      datasets: [
        ...(transFilterType !== 'Incomes' ? [expensesDataset] : []),
        ...(transFilterType !== 'Expenses' ? [incomesDataset] : [])
      ]
    }

    return { transactionsChartData, highestAmount }
  }
  return { parseChartData }
}
