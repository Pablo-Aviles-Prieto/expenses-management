import React, { createContext, useState, useMemo } from 'react'
import type { LeftMenuContextData } from '@/interfaces'

type LeftMenuProviderI = {
  children: React.ReactNode
}

export const LeftMenuContext = createContext<LeftMenuContextData | undefined>(undefined)

export const LeftMenuProvider: React.FC<LeftMenuProviderI> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true)

  const switchState = () => {
    setIsOpen(prev => !prev)
  }

  const contextValue = useMemo(() => ({ isOpen, switchState }), [isOpen])

  return <LeftMenuContext.Provider value={contextValue}>{children}</LeftMenuContext.Provider>
}
