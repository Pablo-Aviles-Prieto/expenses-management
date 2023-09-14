/* eslint-disable max-len */
import { Providers } from '@/components/Providers'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Expense manager',
  description:
    'A powerful expense tracker app that allows you to upload CSV files from your bank, visualize your expenses and income, and gain better insight into your money flow.',
  keywords:
    'Expense tracker, money tracker, expenses, CSV import, bank statement, financial management, personal finance, budgeting',
  authors: [{ name: 'Pablo Avilés', url: 'https://github.com/Pablo-Aviles-Prieto' }]
}

const RootLayout = ({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export default RootLayout
