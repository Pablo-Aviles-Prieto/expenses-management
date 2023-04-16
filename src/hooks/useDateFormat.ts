import { useContext } from 'react'
import { DateFormatContext } from '@/contexts/DateFormat'
import { dateFormat } from '@/utils/const'

type IDateFormatKey = keyof typeof dateFormat

export const useDateFormat = () => {
  const context = useContext(DateFormatContext)

  if (!context) {
    throw new Error('useDateFormat must be used within a DateFormatProvider')
  }

  const { dateFormatSelected, setDateFormatSelected } = context

  const changeDateFormat = (dateFormatKey: IDateFormatKey) => {
    setDateFormatSelected(dateFormat[dateFormatKey])
  }

  return { dateFormatSelected, changeDateFormat }
}
