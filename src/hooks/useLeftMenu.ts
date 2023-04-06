import { useContext } from 'react'
import { LeftMenuContext } from '@/contexts/LeftMenu'

export const useLeftMenu = () => {
  const context = useContext(LeftMenuContext)

  if (!context) {
    throw new Error('useLeftMenu must be used within a LeftMenuProvider')
  }

  const switchState = () => {
    context.switchState()
  }

  return { isOpen: context.isOpen, switchState }
}
