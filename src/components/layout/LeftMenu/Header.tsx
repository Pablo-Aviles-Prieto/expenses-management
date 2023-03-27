import type { FC } from 'react'
import { useLeftMenu } from '@/hooks/useLeftMenu'
import { Maximize, Minimize } from '../../icons'

type ButtonsI = {
  width: number
  height: number
  className: string
  onClick: () => void
}

const IconToRender = (props: ButtonsI) => {
  const leftMenu = useLeftMenu()
  return leftMenu.isOpen ? <Minimize {...props} /> : <Maximize {...props} />
}

export const Header: FC = () => {
  const { switchState } = useLeftMenu()

  return (
    <div className="flex items-center justify-between h-16">
      <p className="text-2xl font-bold">ExpenseManager</p>
      <IconToRender width={24} height={24} className="cursor-pointer" onClick={switchState} />
    </div>
  )
}
