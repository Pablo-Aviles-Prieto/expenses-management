import type { FC } from 'react'
import { useLeftMenu } from '@/hooks/useLeftMenu'
import { Header } from './Header'

type Props = {
  children: JSX.Element
}

export const Content: FC<Props> = ({ children }) => {
  const leftMenu = useLeftMenu()

  const leftMargin: string = leftMenu.isOpen ? 'ml-72' : 'ml-12'

  return (
    <div className={`transition-spacing duration-500 ease-out ${leftMargin}`}>
      <Header classes="px-12" />
      <div className="h-full px-12 py-6">{children}</div>
    </div>
  )
}
