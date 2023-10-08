import { TransactionObjBack } from '@/interfaces/Transactions'
import { format, max, min, parseISO } from 'date-fns'

type Params = {
  transactions: TransactionObjBack[]
  stringFormatReturned: string
}

export const getMinMaxDates = ({ transactions, stringFormatReturned }: Params) => {
  const dates = transactions.map(transaction => parseISO(transaction.date))

  const minDate = min(dates)
  const maxDate = max(dates)

  const minDateString = format(minDate, stringFormatReturned)
  const maxDateString = format(maxDate, stringFormatReturned)

  return { minDate: minDateString, maxDate: maxDateString }
}
