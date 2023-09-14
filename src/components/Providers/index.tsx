import { DateFormatProvider } from '@/contexts'
import type { FC, ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'
import { Layout } from '../layout/Layout'

type Props = {
  children: ReactNode
}

export const Providers: FC<Props> = ({ children }) => {
  return (
    <DateFormatProvider>
      <ToastContainer />
      <Layout>{children}</Layout>
    </DateFormatProvider>
  )
}
