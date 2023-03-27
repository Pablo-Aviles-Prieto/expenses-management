/* eslint-disable max-len */
import type { FC } from 'react'

type PropsI = {
  children: JSX.Element
  type: 'incomes' | 'expenses' | 'balance'
}

type BgClassesI = {
  [Key in PropsI['type']]: string
}

export const SummaryCard: FC<PropsI> = ({ children, type }) => {
  const bgClasses: BgClassesI = {
    incomes: 'from-green-500 via-green-700 to-green-900',
    expenses: 'from-red-500 via-red-700 to-red-900',
    balance: 'from-purple-500 via-purple-700 to-purple-900'
  }

  return (
    <div
      className={`relative w-full h-48 p-5 overflow-hidden rounded-lg shadow-lg bg-gradient-to-r ${bgClasses[type]}`}
    >
      <div className="absolute w-32 h-32 bg-white rounded-full right-4 -bottom-12 bg-opacity-10 " />
      <div className="absolute w-40 h-40 bg-white rounded-full -right-14 bottom-12 bg-opacity-10 " />
      {children}
    </div>
  )
}
