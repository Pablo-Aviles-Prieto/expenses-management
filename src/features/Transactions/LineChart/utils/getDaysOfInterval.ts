import { eachDayOfInterval, format, parseISO } from 'date-fns'

type Params = {
  startDate: string
  endDate: string
  stringFormatReturned: string
}

export const getDaysOfInterval = ({ startDate, endDate, stringFormatReturned }: Params) => {
  const start = parseISO(startDate)
  const end = parseISO(endDate)

  const dateInterval = { start, end }
  const dates = eachDayOfInterval(dateInterval)

  return dates.map(date => format(date, stringFormatReturned))
}
