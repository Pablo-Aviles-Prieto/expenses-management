import type { FC } from 'react'
import { useLeftMenu } from '@/hooks/useLeftMenu'
import { Maximize, Minimize } from '../icons'

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

export const LeftMenu: FC = () => {
  const leftMenu = useLeftMenu()

  const leftMenuStateHandler = () => {
    leftMenu.switchState()
  }

  const sideBarMargin: string = leftMenu.isOpen ? '-ml-0' : '-ml-60'
  const sideBarPadding: string = leftMenu.isOpen ? 'px-4' : 'px-3'

  return (
    <div
      // eslint-disable-next-line max-len
      className={`fixed top-0 left-0 h-full overflow-auto transition-spacing ease-out shadow-lg w-72 duration-500 z-1 ${sideBarMargin} ${sideBarPadding}`}
    >
      <div className="flex items-center justify-between h-16">
        <p className="text-2xl font-bold">ExpenseManager</p>
        <IconToRender width={24} height={24} className="cursor-pointer" onClick={leftMenuStateHandler} />
      </div>
      <p className="h-56 my-6">User Block</p>
      <p className="h-48 my-6">Menu</p>
      <p>My info</p>
    </div>
  )
}
