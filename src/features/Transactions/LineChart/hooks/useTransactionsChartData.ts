'use client'

import { TransactionObjBack } from '@/interfaces/Transactions'
import { dateFormat } from '@/utils/const'
import { format } from 'date-fns'
import { useDateFormat } from '@/hooks/useDateFormat'
import { getDaysOfInterval } from '../utils/getDaysOfInterval'
import { getMinMaxDates } from '../utils/getMinMaxDates'
import { Dataset, LineChartData } from '../interfaces'

type MainParams = {
  transactions: TransactionObjBack[]
}

type GenerateDatasetParams = {
  transArray: TransactionObjBack[]
  label: string
}

const RED_COLOR = '#e00000'

export const useTransactionsChartData = ({ transactions }: MainParams) => {
  const { dateFormatSelected } = useDateFormat()
  const incomesTrans = transactions.filter(trans => trans.amount >= 0)
  const expensesTrans = transactions.filter(trans => trans.amount < 0)

  const { minDate, maxDate } = getMinMaxDates({
    transactions,
    stringFormatReturned: dateFormat.ISO
  })

  const datesInterval = getDaysOfInterval({
    startDate: minDate,
    endDate: maxDate,
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
    labels: datesInterval.map(date =>
      format(new Date(date), dateFormatSelected === 'dd-MM-yyyy' ? 'dd-MM-yy' : 'MM-dd-yy')
    ),
    datasets: [expensesDataset, incomesDataset]
  }

  return { transactionsChartData, highestAmount }
}
