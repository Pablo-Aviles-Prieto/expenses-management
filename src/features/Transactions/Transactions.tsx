/* eslint-disable max-len */
/* eslint-disable no-void */

'use client'

import { TransactionObjBack } from '@/interfaces/Transactions'
import { FC, useEffect, useState } from 'react'
import { CardContainer } from '@/components/styles/CardContainer'
import { usePersistData } from '@/hooks/usePersistData'
import { useFetch } from '@/hooks/useFetch'
import { useCustomSession } from '@/hooks/useCustomSession'
import { format } from 'date-fns'
import { URL_API, dateFormat } from '@/utils/const'
import { TransactionList } from './TransactionList'
import LineChart from './LineChart'
import { TransactionListPagination } from './TransactionListPagination'
import { useTransactionsChartData } from './LineChart/hooks/useTransactionsChartData'
import { LineChartData } from './LineChart/interfaces'
import { TransactionListFilter } from './TransactionListFilter'

type ResponseI = {
  ok: boolean
  transactions?: TransactionObjBack[]
  error?: string
}

type PropsI = {
  transResponse: ResponseI
}

type ResponseFilteredDataI = {
  ok: boolean
  transactions?: TransactionObjBack[]
  error?: string
}

const TABLE_BORDER_COLOR = 'border-gray-500'
const TABLE_PADDING_X = 'px-2'
const NAME_CELL_CLASSES = 'w-4/12'
const AMOUNT_CELL_CLASSES = 'w-2/12 text-center'
const DATE_CELL_CLASSES = 'w-2/12 text-center'
const CATEGORIES_CELL_CLASSES = 'w-2/12 text-center'
const NOTES_CELL_CLASSES = 'w-2/12 text-center'
const ACTIONS_CELL_CLASSES = 'w-2/12 text-center'

const DROPDOWN_OPTIONS = ['All transactions', 'Incomes', 'Expenses']

const URL_POST_TRANSACTION = `${URL_API || ''}/api/transactions/filtered`

// TODO: Limit the number of chars showed for the name. Use a function showing ellipsis.
// Also do the same for the notes, limit the length of the characters whogin on the Popover
export const Transactions: FC<PropsI> = ({ transResponse }) => {
  const { transactionStartDate, transactionEndDate } = usePersistData()
  const [transResponseRaw, setTransResponseRaw] = useState<TransactionObjBack[] | undefined>(
    transResponse.transactions
  )
  const [transPaginated, setTransPaginated] = useState<TransactionObjBack[]>(
    transResponse.transactions ?? []
  )
  const { parseChartData } = useTransactionsChartData()
  const { transactionsChartData, highestAmount } = parseChartData(transResponse.transactions ?? [])
  const [transactionsChart, setTransactionsChart] = useState<LineChartData>(transactionsChartData)
  const [highestChartNumber, setHighestChartNumber] = useState(highestAmount)
  const [transFilteredType, setTransFilteredType] = useState<string>(DROPDOWN_OPTIONS[0])
  const [isFilteringData, setIsFilteringData] = useState(true)
  const { data: dataSession } = useCustomSession()
  const { fetchPetition } = useFetch()

  const fetchFilteredTransactions = async (url: string) => {
    const extraHeaders = {
      Authorization: `Bearer ${dataSession?.accessToken || ''}`
    }
    return fetchPetition<ResponseFilteredDataI>(
      url,
      {
        method: 'GET'
      },
      extraHeaders
    )
  }

  const transTypeQueryParam = () => {
    return transFilteredType === 'All transactions'
      ? ''
      : transFilteredType === 'Incomes'
      ? '&transType=incomes'
      : '&transType=expenses'
  }

  const handleFiltering = async () => {
    if (!transactionStartDate || !transactionEndDate) {
      // TODO: Set a warning/error message in top of the date picker
      // informing that a date is necessary
      return
    }
    setIsFilteringData(true)
    const formatedStartDate = format(new Date(transactionStartDate), dateFormat.ISO)
    const formatedEndDate = format(new Date(transactionEndDate), dateFormat.ISO)
    const transTypeParams = transTypeQueryParam()

    try {
      const transFiltered = await fetchFilteredTransactions(
        `${URL_POST_TRANSACTION}?startDate=${formatedStartDate}&endDate=${formatedEndDate}${transTypeParams}`
      )

      if (transFiltered.ok && transFiltered.transactions) {
        const { transactionsChartData: transChartData, highestAmount: highestChartData } =
          parseChartData(transFiltered.transactions)
        setTransactionsChart(transChartData)
        setHighestChartNumber(highestChartData)
        setTransResponseRaw(transFiltered.transactions)
      } else {
        // TODO: Display warning toast asking to select different dates (no data)
      }
    } catch (err) {
      // TODO: Display error toast
    } finally {
      setIsFilteringData(false)
    }
  }

  useEffect(() => {
    void handleFiltering()
  }, [transactionStartDate, transactionEndDate, transFilteredType])

  if (!transResponseRaw || transResponseRaw?.length === 0) {
    // TODO: Improve message
    return <div>There are no transactions yet! Lets make some investments</div>
  }

  const handleTransFilter = (value: string) => {
    // TODO: It should clean the filters of the list whenever this main filters get updated
    setTransFilteredType(value)
  }

  return (
    <>
      <CardContainer containerWidth="full">
        <LineChart
          transactionsChart={transactionsChart}
          highestChartNumber={highestChartNumber}
          isFilteringData={isFilteringData}
          dropdownOptions={DROPDOWN_OPTIONS}
          handleTransFilter={handleTransFilter}
        />
      </CardContainer>
      <CardContainer containerWidth="full">
        <TransactionListFilter />
        <div className={`border rounded-lg ${TABLE_BORDER_COLOR}`}>
          <div
            className={`font-bold text-xl flex items-center py-2 bg-indigo-700 
						rounded-t-lg border-b ${TABLE_PADDING_X} ${TABLE_BORDER_COLOR}`}
          >
            <div className={`${NAME_CELL_CLASSES}`}>Name</div>
            <div className={`${AMOUNT_CELL_CLASSES}`}>Amount</div>
            <div className={`${DATE_CELL_CLASSES}`}>Date</div>
            <div className={`${CATEGORIES_CELL_CLASSES}`}>Categories</div>
            <div className={`${NOTES_CELL_CLASSES}`}>Notes</div>
            <div className={`${ACTIONS_CELL_CLASSES}`}>Actions</div>
          </div>
          {/* TODO: Create filters that would modify the data only for the list, so it should
					be handled inside TransactionList */}
          <TransactionList transactions={transPaginated} isFilteringData={isFilteringData} />
        </div>
        <TransactionListPagination
          rawTransactions={transResponseRaw}
          setTransPaginated={setTransPaginated}
        />
      </CardContainer>
    </>
  )
}
