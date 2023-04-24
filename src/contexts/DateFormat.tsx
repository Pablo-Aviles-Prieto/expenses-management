import React, { createContext, useState, useMemo } from 'react'
import { DateFormatValues } from '@/interfaces'

type LeftMenuProviderI = {
  children: React.ReactNode
}

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
