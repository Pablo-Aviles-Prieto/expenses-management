import { maxWidthSize } from '@/utils/const'
import type { FC, ReactNode } from 'react'

type PropsI = {
  containerWidth?: keyof typeof maxWidthSize
  children: ReactNode
}

export const CardContainer: FC<PropsI> = ({ children, containerWidth = 'sm' }) => {
  const maxWidthClass = maxWidthSize[containerWidth] || 'max-w-sm'
  return (
    <div
      className={`max-w- px-8 pt-6 pb-8 mb-4 text-gray-300 rounded shadow-md
			bg-gradient-to-br from-indigo-800 via-[90%] via-indigo-900 to-indigo-700
			w-full ${maxWidthClass}`}
    >
      {children}
    </div>
  )
}
