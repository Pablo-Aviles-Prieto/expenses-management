'use client'

import React, { FC } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useDateFormat } from '@/hooks/useDateFormat'
import { FormInputContainer } from '../styles'

type DateRange = [Date | null, Date | null]

type PropsI = {
  startDate: Date | null
  endDate: Date | null
  onChange: (dates: DateRange) => void
  isClearable?: boolean
  forbidFutureDates?: boolean
}

const DateRangePicker: FC<PropsI> = ({
  startDate,
  endDate,
  onChange,
  isClearable = true,
  forbidFutureDates = true
}) => {
  const { dateFormatSelected } = useDateFormat()

  return (
    <FormInputContainer id="" label="" removeMargins removeLabel>
      <DatePicker
        selected={startDate}
        onChange={onChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        isClearable={isClearable}
        placeholderText="Filter by range date"
        maxDate={forbidFutureDates ? new Date() : null}
        className="text-[15px] font-bold text-indigo-600"
        dateFormat={dateFormatSelected}
      />
    </FormInputContainer>
  )
}

export default DateRangePicker
