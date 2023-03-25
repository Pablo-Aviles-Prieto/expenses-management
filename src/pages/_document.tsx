/* eslint-disable max-len */
import { Html, Head, Main, NextScript } from 'next/document'
import type { FC } from 'react'

const Document: FC = () => (
  <Html lang="en">
    <Head>
      <meta
        name="description"
        content="A powerful expense tracker app that allows you to upload CSV files from your bank, visualize your expenses and income, and gain better insight into your money flow."
      />
      <meta
        name="keywords"
        content="Expense tracker, money tracker, expenses, CSV import, bank statement, financial management, personal finance, budgeting"
      />
      <meta name="author" content="Pablo Avilés" />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
)

export default Document
