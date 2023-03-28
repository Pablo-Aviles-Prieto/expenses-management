import { Layout } from '@/components/layout/Layout'
import type { AppProps } from 'next/app'
import type { FC } from 'react'
import '@/styles/global.css'
import { bootstrapMongoDB } from '@/config/database'

// eslint-disable-next-line no-void
void bootstrapMongoDB()

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
