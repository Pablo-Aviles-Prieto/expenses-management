import { FC, ReactNode } from 'react'

type PropsI = {
  children: ReactNode
}

export const CardContainer: FC<PropsI> = ({ children }) => {
  return <div className="px-8 pt-6 pb-8 mb-4 bg-indigo-800 rounded shadow-md">{children}</div>
}
