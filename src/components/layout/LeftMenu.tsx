import type { FC } from 'react'
import { Maximize } from '../icons'

export const LeftMenu: FC = () => {
  return (
    <div className="fixed top-0 left-0 h-full w-72 px-4 overflow-auto transition ease-out duration-400 z-1">
      <div className="h-16 flex items-center justify-between">
        <p className="font-bold text-2xl">ExpenseManager</p>
        <Maximize width={24} height={24} className="cursor-pointer" />
      </div>
      <p className="h-56 my-6">User Block</p>
      <p className="h-48 my-6">Menu</p>
      <p>My info</p>
    </div>
  )
}
