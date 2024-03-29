'use client'

import { DateFormatProvider } from '@/contexts'
import type { FC, ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'
import { SessionProvider } from 'next-auth/react'
import { Layout } from '../../features/layout/Layout'
import 'react-toastify/dist/ReactToastify.css'
import '@/styles/global.css'
import '@/styles/globalDatePicker.css'
import '@/styles/addDatePicker.css'
import '@/styles/filePonder.css'

type Props = {
  children: ReactNode
}

export const Providers: FC<Props> = ({ children }) => {
  return (
    <SessionProvider>
      <DateFormatProvider>
        <ToastContainer />
        <Layout>{children}</Layout>
      </DateFormatProvider>
    </SessionProvider>
  )
}
