/* eslint-disable no-void */
/* eslint-disable max-len */

'use client'

import Dropdown from '@/components/Dropdown'
import { FormBtn } from '@/components/Form'
import { SimpleFieldText } from '@/components/SimpleFieldText'
import { useCustomToast } from '@/hooks'
import { useCustomSession } from '@/hooks/useCustomSession'
import { useFetch } from '@/hooks/useFetch'
import { TransactionObjBack } from '@/interfaces/Transactions'
import { URL_API, dateFormat, errorMessages } from '@/utils/const'
import { format } from 'date-fns'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

type InputFilterOptions = 'Name' | 'Amount'
type InputFilterAmount = '>' | '<'

type ResponseFilteredDataI = {
  ok: boolean
  transactions?: TransactionObjBack[]
  error?: string
}

type Props = {
  transResponseRaw: TransactionObjBack[]
  transactionStartDate: Date | null
  transactionEndDate: Date | null
  setIsFilteringTransList: React.Dispatch<React.SetStateAction<boolean>>
  setFilteredTransList: React.Dispatch<React.SetStateAction<TransactionObjBack[] | undefined>>
  transTypeQueryParam: () => string
  resetPagination: () => void
}

const DROPDOWN_FILTER_BY_OPTIONS = ['Name', 'Amount']
const DROPDOWN_FILTER_BY_AMOUNT = ['>', '<']
const INIT_FILTER_VALUES = {
  fieldText: '',
  optionsFilter: 'Name' as InputFilterOptions,
  amountFilter: '>' as InputFilterAmount,
  categories: []
}
const URL_POST_TRANSACTION = `${URL_API || ''}/api/transactions/filtered`

export const TransactionListFilter = forwardRef((props: Props, ref: React.Ref<any>) => {
  const [paramsToFetch, setParamsToFetch] = useState<string | undefined>(undefined)
  const [fieldTextValue, setFieldTextValue] = useState(INIT_FILTER_VALUES.fieldText)
  const [inputOptionFilter, setInputOptionFilter] = useState<InputFilterOptions>(
    INIT_FILTER_VALUES.optionsFilter
  )
  const [inputAmountFilter, setInputAmountFilter] = useState<InputFilterAmount>(
    INIT_FILTER_VALUES.amountFilter
  )
  const [categoriesSelected, setCategoriesSelected] = useState<string[]>(
    INIT_FILTER_VALUES.categories
  )
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

  useEffect(() => {
    if (!paramsToFetch || !props.transactionStartDate || !props.transactionEndDate) {
      return
    }
    props.setIsFilteringTransList(true)
    const generalQueryParams = props.transTypeQueryParam()
    const formatedStartDate = format(new Date(props.transactionStartDate), dateFormat.ISO)
    const formatedEndDate = format(new Date(props.transactionEndDate), dateFormat.ISO)
    const URL = `${URL_POST_TRANSACTION}?startDate=${formatedStartDate}&endDate=${formatedEndDate}${generalQueryParams}${paramsToFetch}`
    props.setIsFilteringTransList(false)
  }, [paramsToFetch])

  useEffect(() => {
    if (!paramsToFetch) {
      // Whenever the queryParams are undefined, restart this state to undefined
      props.setFilteredTransList(undefined)
      return
    }

    const fetchData = async () => {
      if (!props.transactionStartDate || !props.transactionEndDate) return
      // Whenever it filters the list, reset pagination
      props.resetPagination()
      try {
        props.setIsFilteringTransList(true)

        const generalQueryParams = props.transTypeQueryParam()
        const formatedStartDate = format(new Date(props.transactionStartDate ?? ''), dateFormat.ISO)
        const formatedEndDate = format(new Date(props.transactionEndDate ?? ''), dateFormat.ISO)

        const URL = `${URL_POST_TRANSACTION}?startDate=${formatedStartDate}&endDate=${formatedEndDate}${generalQueryParams}&${paramsToFetch}`
        const response = await fetchFilteredTransactions(URL)
        if (response.ok) {
          props.setFilteredTransList(response.transactions)
        } else {
          const errorString = response.error ? response.error : errorMessages.generic
          showToast({
            msg: errorString,
            options: { type: 'error' }
          })
        }
      } catch (err) {
        const errorString = err instanceof Error ? err.message : errorMessages.generic
        showToast({
          msg: errorString,
          options: { type: 'error' }
        })
      } finally {
        props.setIsFilteringTransList(false)
      }
    }

    void fetchData()
  }, [paramsToFetch])

  const handleSubmit = () => {
    if (categoriesSelected.length === 0 && !fieldTextValue) {
      return
    }
    if (inputOptionFilter === 'Amount' && Number.isNaN(Number(fieldTextValue))) {
      return
    }
    const params = new URLSearchParams()

    if (categoriesSelected.length > 0) {
      params.append('categories', categoriesSelected.join(','))
    }

    if (fieldTextValue) {
      if (inputOptionFilter === 'Amount') {
        params.append('filterType', 'Amount')
        params.append('filterOperator', inputAmountFilter === '>' ? 'gt' : 'lt')
        params.append('filterValue', fieldTextValue)
      } else if (inputOptionFilter === 'Name') {
        params.append('filterType', 'Name')
        params.append('filterValue', fieldTextValue)
      }
    }
    setParamsToFetch(params.toString())
  }

  const categoryNamesSet = props.transResponseRaw.reduce<Set<string>>((acc, transaction) => {
    transaction.categories.forEach(cat => acc.add(cat.name))
    return acc
  }, new Set())
  const categoryNamesArray = Array.from(categoryNamesSet)

  const handleFilterByOptions = (e: string | string[]) => {
    setInputOptionFilter(e as InputFilterOptions)
    setFieldTextValue('')
  }

  const handleFilterByAmount = (e: string | string[]) => {
    setInputAmountFilter(e as InputFilterAmount)
  }

  const handleCategoriesSelecteds = (e: string | string[]) => {
    setCategoriesSelected(e as string[])
  }

  const resetFilters = () => {
    setFieldTextValue(INIT_FILTER_VALUES.fieldText)
    setInputOptionFilter(INIT_FILTER_VALUES.optionsFilter)
    setInputAmountFilter(INIT_FILTER_VALUES.amountFilter)
    setCategoriesSelected(INIT_FILTER_VALUES.categories)
    setParamsToFetch(undefined) // Resets the params of this filters
  }

  useImperativeHandle(ref, () => ({
    resetFilters
  }))

  return (
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-bold">Transactions:</h3>
      <div className="flex items-center justify-center gap-2">
        {inputOptionFilter === 'Amount' && (
          <Dropdown
            dropdownOptions={DROPDOWN_FILTER_BY_AMOUNT}
            value={inputAmountFilter}
            onChange={handleFilterByAmount}
            setMinWidth="min-w-[3.9rem]"
          />
        )}
        <SimpleFieldText
          id="name-or-value"
          value={fieldTextValue}
          onChange={setFieldTextValue}
          placeholder={
            inputOptionFilter === 'Name' ? 'Type a name to filter' : 'Type an amount to filter'
          }
          classes="w-[13rem]"
          type={inputOptionFilter === 'Name' ? 'text' : 'number'}
          step={inputOptionFilter === 'Name' ? undefined : '0.01'}
        />
        <Dropdown
          dropdownOptions={DROPDOWN_FILTER_BY_OPTIONS}
          value={inputOptionFilter}
          onChange={handleFilterByOptions}
          setMinWidth="min-w-[7rem]"
        />
        <Dropdown
          dropdownOptions={categoryNamesArray}
          value={categoriesSelected}
          onChange={handleCategoriesSelecteds}
          multiple
          multipleTypeName="categories"
          setMinWidth="w-[15rem]"
        />
        <FormBtn
          isDisabled={!fieldTextValue && categoriesSelected.length === 0}
          onClick={handleSubmit}
        >
          Apply
        </FormBtn>
      </div>
    </div>
  )
})
