import type { FC } from 'react'
import { Header } from './Header'
import { LeftMenu } from './LeftMenu'

type Props = {
  children: JSX.Element
}

export const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="relative">
      <Header />
      <LeftMenu />
      <div className="mx-12 my-6">{children}</div>
    </div>
  )
}
