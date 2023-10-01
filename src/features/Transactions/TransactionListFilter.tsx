'use client'

import Dropdown from '@/components/Dropdown'
import { FormBtn } from '@/components/Form'
import { SimpleFieldText } from '@/components/SimpleFieldText'
import { TransactionObjBack } from '@/interfaces/Transactions'
import { forwardRef, useImperativeHandle, useState } from 'react'

const DROPDOWN_FILTER_BY_OPTIONS = ['Name', 'Amount']
const DROPDOWN_FILTER_BY_AMOUNT = ['>', '<']

type InputFilterOptions = 'Name' | 'Amount'
type InputFilterAmount = '>' | '<'

type Props = {
  transResponseRaw: TransactionObjBack[]
}

const INIT_FILTER_VALUES = {
  fieldText: '',
  optionsFilter: 'Name' as InputFilterOptions,
  amountFilter: '>' as InputFilterAmount,
  categories: []
}

export const TransactionListFilter = forwardRef((props: Props, ref: React.Ref<any>) => {
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

  const handleSubmit = () => {
    // TODO: Check which option (name or amount) is selected and parse the data
    // and call to the correctly endpoint!
    console.log('fieldTextValue', fieldTextValue)
    console.log('inputOptionFilter', inputOptionFilter)
    console.log('inputAmountFilter', inputAmountFilter)
    console.log('categoriesSelected', categoriesSelected)
  }

  const categoryNamesSet = props.transResponseRaw.reduce<Set<string>>((acc, transaction) => {
    transaction.categories.forEach(cat => acc.add(cat.name))
    return acc
  }, new Set())
  const categoryNamesArray = Array.from(categoryNamesSet)

  const handleFilterByOptions = (e: string | string[]) => {
    setInputOptionFilter(e as InputFilterOptions)
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
