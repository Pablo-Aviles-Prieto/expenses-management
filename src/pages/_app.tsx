import { Layout } from '@/components/layout/Layout'
import type { AppProps as NextAppProps } from 'next/app'
import type { FC } from 'react'
import { SessionProvider } from 'next-auth/react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { DateFormatProvider } from '@/contexts'
import '@/styles/global.css'
import '@/styles/datePicker.css'

interface AppPropsI extends NextAppProps {
  pageProps: {
    session?: unknown
  } & NextAppProps['pageProps']
}

const App: FC<AppPropsI> = ({ Component, pageProps }: AppPropsI) => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    <SessionProvider session={pageProps.session}>
      <DateFormatProvider>
        <ToastContainer />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </DateFormatProvider>
    </SessionProvider>
  )
}

export default App
