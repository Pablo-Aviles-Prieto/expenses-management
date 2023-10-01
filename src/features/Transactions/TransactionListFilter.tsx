'use client'

import Dropdown from '@/components/Dropdown'
import { FormBtn } from '@/components/Form'
import { SimpleFieldText } from '@/components/SimpleFieldText'
import { useState } from 'react'

const DROPDOWN_FILTER_BY_OPTIONS = ['Name', 'Amount']
const DROPDOWN_CATEGORIES = [
  'Category1',
  'Category2',
  'Category3',
  'Category4',
  'Category5',
  'Category6',
  'Category7',
  'Category8',
  'Category9',
  'Category10',
  'Category11'
]

type InputOptions = 'Name' | 'Amount'

// TODO: Create a custom hook who calls an endpoint to get all the categories
// given a userId
export const TransactionListFilter = () => {
  // TODO: Elevate the state so it can be resetted whenever the general filters
  // get updated
  const [fieldTextValue, setFieldTextValue] = useState('')
  const [inputOptionFilter, setInputOptionFilter] = useState<InputOptions>('Name')
  const [categoriesSelected, setCategoriesSelected] = useState<string[]>([])

  const handleSubmit = () => {
    // TODO: Check which option (name or amount) is selected and parse the data
    // and call to the correctly endpoint
    console.log('fieldTextValue', fieldTextValue)
    console.log('inputOptionFilter', inputOptionFilter)
    console.log('categoriesSelected', categoriesSelected)
  }

  const handleFilterByOptions = (e: string | string[]) => {
    setInputOptionFilter(e as InputOptions)
  }

  const handleCategoriesSelecteds = (e: string | string[]) => {
    setCategoriesSelected(e as string[])
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-bold">Transactions:</h3>
      <div className="flex items-center justify-center gap-2">
        <SimpleFieldText
          id="name-or-value"
          onChange={setFieldTextValue}
          placeholder={
            inputOptionFilter === 'Name' ? 'Type a name to filter' : 'Type an amount to filter'
          }
          classes="w-[13rem]"
        />
        <Dropdown
          dropdownOptions={DROPDOWN_FILTER_BY_OPTIONS}
          onChange={handleFilterByOptions}
          setMinWidth="min-w-[7rem]"
        />
        <Dropdown
          dropdownOptions={DROPDOWN_CATEGORIES}
          onChange={handleCategoriesSelecteds}
          multiple
          multipleTypeName="categories"
          setMinWidth="w-[15rem]"
        />
        {/* TODO: Update disable option, whenever there is nothign typed on fieldTextValue
				or if there arent selected categories */}
        <FormBtn isDisabled={false} onClick={handleSubmit}>
          Apply
        </FormBtn>
      </div>
    </div>
  )
}
