import type { AppProps } from 'next/app'
import type { FC } from 'react'
import '@/styles/global.css'

const App: FC<AppProps> = ({ Component, pageProps }) => <Component {...pageProps} />

export default App
