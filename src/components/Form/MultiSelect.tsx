/* eslint-disable max-len */
import { Fragment, useRef, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { Check, ChevronDown } from '../icons'
import { FormInputContainer } from '../styles'

type PeopleI = {
  id: number
  name: string
}

type CheckSelectedI<T, K extends keyof T> = {
  dataArray: T[]
  dataKey: K
  dataToCheck: T[K]
}

const peopleArray = [
  { id: 1, name: 'Wade Cooper' },
  { id: 2, name: 'Arlene Mccoy' },
  { id: 3, name: 'Devon Webb' },
  { id: 4, name: 'Tom Cook' },
  { id: 5, name: 'Tanya Fox' },
  { id: 6, name: 'Hellen Schmidt' }
]

export const MultiSelect = () => {
  // TODO: Create a useState that gets from the endpoint all the categories the user has saved
  // and some new categories created in this dropdown
  const [pickedData, setPickedData] = useState<PeopleI | null>(null)
  const [dataSelected, setDataSelected] = useState<PeopleI[]>([])
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  console.log('dataSelected', dataSelected)

  // TODO: Modify this to check against the useState having all the categories, instead against
  // the mocked peopleArray
  const filteredPeople =
    query === ''
      ? peopleArray
      : peopleArray.filter(person =>
          person.name.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  function isPeopleI<T>(obj: unknown): obj is PeopleI {
    const asPeopleI = obj as PeopleI
    return (
      typeof obj === 'object' && obj !== null && typeof asPeopleI.id === 'number' && typeof asPeopleI.name === 'string'
    )
  }

  // TODO: I gonna need to pass the type of the data, as im using a helper function to check the typeof
  // from the object to check if it's valid to the setter
  // MAYBE IS NOT DOABLE SINCE TS IS NOT RUNNING AT RUNTIME
  function changeHandler<T extends { id: number }>(value: T | null) {
    if (isPeopleI(value)) {
      setPickedData(value)
      setDataSelected(prevState => {
        const doesExist = prevState.some(dataPrevState => dataPrevState.id === value.id)
        if (doesExist) {
          return prevState.filter(dataPrevState => dataPrevState.id !== value.id)
        }
        return [...prevState, value]
      })
    }
  }

  function checkIfSelected<T, K extends keyof T>({ dataArray, dataKey, dataToCheck }: CheckSelectedI<T, K>) {
    return dataArray.some(data => data[dataKey] === dataToCheck)
  }

  const createCategoryHandler = () => {
    // TODO: Add this category to the useState that will have all the endpoint categories and the created ones
    // but gonna have to create a object accordly to what im storing.
    // probably creating a prop like 'isNewCategory' so the backend can create the new categories
    console.log('query', query)
    // TODO: Check if this is correct since the filteredPeople object its going to be changed
    // and will check a useState that has the new categorie created and the previous ones.
    console.log('inputRef.current', inputRef.current)
    if (inputRef.current) {
      inputRef.current.blur()
      setDataSelected(prevState => {
        return [...prevState, { id: prevState.length, name: query }]
      })
    }
    // TODO: close the option list of the dropdown, maybe is necessary to create a useState and render
    // the option list depending of that boolean
  }

  return (
    // TODO: Style the whole block here or in parent, so it gets at least, some Margin Bottom
    <Combobox value={pickedData} onChange={value => changeHandler(value)}>
      <div className="relative">
        <FormInputContainer label="Previously used categories" id="prevCategories">
          <Combobox.Input
            name="prevCategories"
            displayValue={(_: PeopleI) => ''}
            onChange={e => setQuery(e.target.value)}
            placeholder="Select/Create the categories for this transaction"
            ref={inputRef}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-600 -bottom-6">
            <ChevronDown width={25} height={25} />
          </Combobox.Button>
        </FormInputContainer>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-gray-200 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredPeople.length === 0 && query !== '' ? (
              <div
                onClick={createCategoryHandler}
                className="relative px-4 py-2 text-gray-700 cursor-pointer select-none"
              >
                + Create this category
              </div>
            ) : (
              filteredPeople.map(person => (
                <Combobox.Option
                  key={person.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-indigo-600 text-white' : 'text-gray-600'
                    }`
                  }
                  value={person}
                >
                  {({ active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          checkIfSelected({ dataArray: dataSelected, dataKey: 'id', dataToCheck: person.id })
                            ? 'font-bold'
                            : 'font-normal'
                        }`}
                      >
                        {person.name}
                      </span>
                      {checkIfSelected({ dataArray: dataSelected, dataKey: 'id', dataToCheck: person.id }) ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-white' : 'text-indigo-600'
                          }`}
                        >
                          <Check width={20} height={20} />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
      <div className="flex gap-1">
        Categories selected:{' '}
        {dataSelected.length === 0 ? (
          'No categories selected'
        ) : (
          <ul className="flex gap-2 text-red-400">
            {dataSelected.map(people => {
              return <li key={people.id}>{people.name}</li>
            })}
          </ul>
        )}
      </div>
    </Combobox>
  )
}
