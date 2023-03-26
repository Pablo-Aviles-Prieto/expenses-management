import type { FC } from 'react'

export const Header: FC = () => {
  return (
    <div className="h-16 flex items-center justify-between px-12 pl-80 shadow-md">
      <h3 className="font-semibold text-2xl">ExpenseManager</h3>
      <p>some icons</p>
    </div>
  )
}
