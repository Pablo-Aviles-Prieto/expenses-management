import type { FC } from 'react'
import { Header } from './Header'

type Props = {
  children: JSX.Element
}

export const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      <div className="mx-12 my-6">{children}</div>
    </>
  )
}
