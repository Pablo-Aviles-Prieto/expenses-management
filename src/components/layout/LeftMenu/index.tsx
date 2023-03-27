import type { FC } from 'react'
import { useLeftMenu } from '@/hooks/useLeftMenu'
import { Header } from './Header'
import { Menu } from './Menu'
import { Footer } from './Footer'

const LeftMenu: FC = () => {
  const { isOpen } = useLeftMenu()

  const sideBarMargin: string = isOpen ? '-ml-0' : '-ml-60'
  const sideBarPadding: string = isOpen ? 'px-4' : 'px-3'

  return (
    <div
      // eslint-disable-next-line max-len
      className={`fixed top-0 left-0 h-full overflow-auto transition-spacing ease-out shadow-lg w-72 duration-500 z-1 ${sideBarMargin} ${sideBarPadding}`}
    >
      <Header />
      <Menu />
      <Footer />
    </div>
  )
}

export default LeftMenu
