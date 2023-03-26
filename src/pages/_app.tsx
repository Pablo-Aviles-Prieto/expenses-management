import { Layout } from '@/components/layout/Layout'
import type { AppProps } from 'next/app'
import type { FC } from 'react'
import '@/styles/global.css'

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
