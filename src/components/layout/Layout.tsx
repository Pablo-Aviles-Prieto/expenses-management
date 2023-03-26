import type { FC } from 'react'
import { LeftMenuProvider } from '@/contexts'
import { Content } from './Content'
import { LeftMenu } from './LeftMenu'

type Props = {
  children: JSX.Element
}

export const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="relative">
      <LeftMenuProvider>
        <LeftMenu />
        <Content>{children}</Content>
      </LeftMenuProvider>
    </div>
  )
}
