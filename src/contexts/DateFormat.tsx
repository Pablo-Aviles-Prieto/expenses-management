import { dateFormat } from '@/utils/const'
import React, { createContext, useState, useMemo } from 'react'

type LeftMenuProviderI = {
  children: React.ReactNode
}

type DateFormatValues = (typeof dateFormat)[keyof typeof dateFormat]

type DateFormatContextData = {
  dateFormatSelected: DateFormatValues
  setDateFormatSelected: (value: React.SetStateAction<DateFormatValues>) => void
}

export const DateFormatContext = createContext<DateFormatContextData | undefined>(undefined)

export const DateFormatProvider: React.FC<LeftMenuProviderI> = ({ children }) => {
  // TODO: check localStorage and set/change the value
  const [dateFormatSelected, setDateFormatSelected] = useState<DateFormatValues>('dd-MM-yyyy')

  const contextValue = useMemo(() => ({ dateFormatSelected, setDateFormatSelected }), [dateFormatSelected])

  return <DateFormatContext.Provider value={contextValue}>{children}</DateFormatContext.Provider>
}
