import { Layout } from '@/components/layout/Layout'
import type { AppProps as NextAppProps } from 'next/app'
import type { FC } from 'react'
import { SessionProvider } from 'next-auth/react'
import { ToastContainer } from 'react-toastify'
import '@/styles/global.css'
import 'react-toastify/dist/ReactToastify.css'

interface AppPropsI extends NextAppProps {
  pageProps: {
    session?: unknown
  } & NextAppProps['pageProps']
}

const App: FC<AppPropsI> = ({ Component, pageProps }: AppPropsI) => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    <SessionProvider session={pageProps.session}>
      <ToastContainer />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  )
}

export default App
