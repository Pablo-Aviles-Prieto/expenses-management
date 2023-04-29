/* eslint-disable max-len */
import { Fragment, useState } from 'react'
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

export const ComboboxDropdown = () => {
  const [selectedPeople, setSelected] = useState<PeopleI[]>([])
  const [query, setQuery] = useState('')

  const filteredPeople =
    query === ''
      ? peopleArray
      : peopleArray.filter(person =>
          person.name.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  const changeHandler = (values: PeopleI[] | PeopleI) => {
    setSelected(prevState => {
      if (Array.isArray(values)) {
        let newState: PeopleI[] = []
        values.forEach(value => {
          const doesExist = prevState.some(dataSelected => dataSelected.id === value.id)
          if (doesExist) {
            newState = prevState.filter(dataSelected => dataSelected.id !== value.id)
          } else {
            newState = [...prevState, value]
          }
        })
        console.log('newState', newState)
        return newState
      }

      const doesExist = prevState.some(dataSelected => dataSelected.id === values.id)
      if (doesExist) {
        return prevState.filter(dataSelected => dataSelected.id !== values.id)
      }
      return [...prevState, values]
    })
  }

  function checkIfSelected<T, K extends keyof T>({ dataArray, dataKey, dataToCheck }: CheckSelectedI<T, K>) {
    return dataArray.some(data => data[dataKey] === dataToCheck)
  }

  return (
    <Combobox value={selectedPeople} onChange={values => changeHandler(values)}>
      {({ value }) => {
        return (
          <>
            <div className="relative">
              <FormInputContainer label="Previously used categories" id="prevCategories">
                <Combobox.Input
                  displayValue={(people: PeopleI[]) => people.map(person => person.name).join(', ')}
                  onChange={e => setQuery(e.target.value)}
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
                    <div className="relative px-4 py-2 text-gray-700 cursor-default select-none">Nothing found.</div>
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
                                checkIfSelected({ dataArray: value, dataKey: 'id', dataToCheck: person.id })
                                  ? 'font-bold'
                                  : 'font-normal'
                              }`}
                            >
                              {person.name}
                            </span>
                            {checkIfSelected({ dataArray: value, dataKey: 'id', dataToCheck: person.id }) ? (
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
              {selectedPeople.length === 0 ? (
                'No categories selected'
              ) : (
                <ul className="flex gap-2">
                  {selectedPeople.map(people => {
                    return <li key={people.id}>{people.name}</li>
                  })}
                </ul>
              )}
            </div>
          </>
        )
      }}
    </Combobox>
  )
}
