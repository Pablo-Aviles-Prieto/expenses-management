'use client'

import React, { FC } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
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
  return (
    <FormInputContainer id="" label="">
      <DatePicker
        selected={startDate}
        onChange={onChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        isClearable={isClearable}
        placeholderText="Filter by range date"
        maxDate={forbidFutureDates ? new Date() : null}
      />
    </FormInputContainer>
  )
}

export default DateRangePicker
