/* eslint-disable max-len */
/* eslint-disable no-void */

'use client'

import { TransactionObjBack } from '@/interfaces/Transactions'
import { FC, useEffect, useRef, useState } from 'react'
import { CardContainer } from '@/components/styles/CardContainer'
import { usePersistData } from '@/hooks/usePersistData'
import { useFetch } from '@/hooks/useFetch'
import { useCustomSession } from '@/hooks/useCustomSession'
import { format } from 'date-fns'
import { URL_API, dateFormat, errorMessages } from '@/utils/const'
import { useCustomToast } from '@/hooks'
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

type TransactionListFilterRef = {
  resetFilters: () => void
}

type ResetPagination = {
  resetPage: () => void
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
  const [transFilteredType, setTransFilteredType] = useState<string>(DROPDOWN_OPTIONS[0])
  const { transactionsChartData, highestAmount } = parseChartData({
    transactions: transResponse.transactions ?? [],
    transFilterType: transFilteredType
  })
  const [transactionsChart, setTransactionsChart] = useState<LineChartData>(transactionsChartData)
  const [highestChartNumber, setHighestChartNumber] = useState(highestAmount)
  const [isFilteringData, setIsFilteringData] = useState(true)
  const [isFilteringTransList, setIsFilteringTransList] = useState(false)
  const [filteredTransList, setFilteredTransList] = useState<TransactionObjBack[] | undefined>(
    undefined
  )
  const transactionListFilterRef = useRef<TransactionListFilterRef>(null)
  const resetPageRef = useRef<ResetPagination>(null)
  const { data: dataSession } = useCustomSession()
  const { fetchPetition } = useFetch()
  const { showToast } = useCustomToast()

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

      if (transFiltered.ok && transFiltered.transactions && transFiltered.transactions.length > 0) {
        const { transactionsChartData: transChartData, highestAmount: highestChartData } =
          parseChartData({
            transactions: transFiltered.transactions,
            transFilterType: transFilteredType
          })
        setTransactionsChart(transChartData)
        setHighestChartNumber(highestChartData)
        setTransResponseRaw(transFiltered.transactions)
        // Reset list filters and pagination in child components
        transactionListFilterRef.current?.resetFilters()
        resetPageRef.current?.resetPage()
      } else {
        // TODO?: Set the dates to the previous one if possible
        showToast({
          msg: 'No data for the selected date range. Try with a different range!',
          options: { type: 'warning' }
        })
      }
    } catch (err) {
      const errorString = err instanceof Error ? err.message : errorMessages.generic
      showToast({
        msg: errorString,
        options: { type: 'error' }
      })
    } finally {
      setIsFilteringData(false)
    }
  }

  useEffect(() => {
    void handleFiltering()
  }, [transactionStartDate, transactionEndDate, transFilteredType])

  const handleTransFilter = (value: string | string[]) => {
    if (Array.isArray(value)) {
      return
    }
    setTransFilteredType(value)
  }

  const setPaginatedData = (data: unknown[]) => {
    setTransPaginated(data as TransactionObjBack[])
  }

  const resetPagination = () => {
    resetPageRef.current?.resetPage()
  }

  if (!transResponseRaw || transResponseRaw.length === 0) {
    // TODO: Improve message
    return <div>There are no transactions yet! Lets make some investments</div>
  }

  return (
    <>
      <CardContainer containerWidth="full">
        <LineChart
          transactionsChart={transactionsChart}
          highestChartNumber={highestChartNumber}
          isFilteringData={isFilteringData}
          dropdownOptions={DROPDOWN_OPTIONS}
          transFilteredType={transFilteredType}
          handleTransFilter={handleTransFilter}
        />
      </CardContainer>
      <CardContainer containerWidth="full">
        <TransactionListFilter
          ref={transactionListFilterRef}
          transResponseRaw={transResponseRaw}
          setIsFilteringTransList={setIsFilteringTransList}
          transTypeQueryParam={transTypeQueryParam}
          transactionStartDate={transactionStartDate}
          transactionEndDate={transactionEndDate}
          setFilteredTransList={setFilteredTransList}
          resetPagination={resetPagination}
        />
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
          <TransactionList
            transactions={transPaginated}
            isFilteringData={isFilteringData}
            isFilteringTransList={isFilteringTransList}
          />
        </div>
        <TransactionListPagination
          ref={resetPageRef}
          rawTransactions={transResponseRaw}
          filteredTransList={filteredTransList}
          setTransPaginated={setPaginatedData}
        />
      </CardContainer>
    </>
  )
}
