/* eslint-disable max-len */
import React, { FC, useRef, useState } from 'react'
import { Combobox } from '@headlessui/react'
import { FormInputContainer } from '../styles'
import { Check, ChevronUpDown, Close, CoinsStack } from '../icons'

type CategoryI = {
  id: number
  name: string
  newCategory?: boolean
}

type PropsI = {
  dataArray: CategoryI[]
}

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ')
}

export const MultiPeopleList: FC<PropsI> = ({ dataArray }) => {
  const [query, setQuery] = useState('')
  const [elementList, setElementList] = useState(dataArray)
  // TODO: Accept a prop in the component so it can initialize some values already checked
  const [activeElement, setActiveElement] = useState([dataArray[2], dataArray[3]])
  const inputRef = useRef<HTMLInputElement | null>(null)
  // console.log('elementList', elementList)
  // console.log('activeElement', activeElement)

  const filteredPeople =
    query === ''
      ? elementList
      : elementList.filter(person =>
          person.name.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  const inputFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    if (query !== '') {
      setQuery('')
    }
    e.target.value = ''
  }

  const removeActiveElement = (element: CategoryI) => {
    setActiveElement(existing => existing.filter(p => p.id !== element.id))
  }

  const checkAndCreateNewCategory = () => {
    const newCategoryObj: CategoryI = {
      id: elementList.length + 1,
      name: query,
      newCategory: true
    }
    let alreadyExists: CategoryI | undefined

    setElementList(prevElements => {
      alreadyExists = prevElements.find(elm => elm.name.toLowerCase() === query.toLowerCase())
      return alreadyExists ? prevElements : [...prevElements, newCategoryObj]
    })

    setActiveElement(prevActiveElements => {
      const alreadyActive = prevActiveElements.find(elm => elm.name.toLowerCase() === query.toLowerCase())
      if (alreadyActive) {
        return prevActiveElements
      }

      const getElement = elementList.find(elm => elm.id === alreadyExists?.id)

      return getElement ? [...prevActiveElements, getElement] : [...prevActiveElements, newCategoryObj]
    })

    setQuery('')

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  // TODO: Whenever the user press enter, should execute checkAndCreateNewCategory to check and if necessary
  // create the category
  return (
    <>
      <Combobox
        value={activeElement}
        onChange={(people: CategoryI[]) => setActiveElement(people)}
        name="people"
        multiple
      >
        <div className="relative">
          <span className="inline-block w-full rounded-md shadow-sm">
            <FormInputContainer label="Categories" id="categories">
              <span className="flex flex-wrap gap-2">
                {activeElement.map(element => (
                  <span key={element.id} className="flex items-center gap-1 rounded bg-indigo-400 px-2 py-0.5">
                    <span className="text-gray-200">{element.name}</span>
                    <Close
                      className="cursor-pointer"
                      width={16}
                      height={16}
                      stroke="#1d1d1d"
                      onClick={e => {
                        e.stopPropagation()
                        e.preventDefault()
                        removeActiveElement(element)
                      }}
                    />
                  </span>
                ))}
                <Combobox.Button className="flex-grow">
                  <Combobox.Input
                    onChange={event => setQuery(event.target.value)}
                    onFocus={e => inputFocus(e)}
                    className="w-full text-gray-600 bg-gray-200 focus:outline-none"
                    placeholder="Search or create a category..."
                    id="categories"
                    ref={inputRef}
                  />
                </Combobox.Button>
              </span>
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-600 -bottom-5">
                <ChevronUpDown width={25} height={25} />
              </Combobox.Button>
            </FormInputContainer>
          </span>

          <div className="absolute z-10 w-full bg-gray-200 rounded-md shadow-lg">
            <Combobox.Options className="py-1 overflow-auto text-base leading-6 rounded-md shadow-xs max-h-60 focus:outline-none sm:text-sm sm:leading-5">
              {filteredPeople.map((person, i) => (
                <Combobox.Option
                  key={person.id}
                  value={person}
                  className={({ active }) => {
                    return classNames(
                      'relative cursor-default select-none py-2 pl-10 pr-4 focus:outline-none',
                      active ? 'bg-indigo-600 text-white' : 'text-gray-600'
                    )
                  }}
                >
                  {({ active, selected }) => (
                    <>
                      <span
                        onClick={() => console.log('clicked option')}
                        className={classNames('block truncate', selected ? 'font-semibold' : 'font-normal')}
                      >
                        {person.name}
                      </span>
                      {selected && (
                        <span
                          className={classNames(
                            'absolute inset-y-0 left-0 flex items-center pl-3',
                            active ? 'text-white' : 'text-indigo-600'
                          )}
                        >
                          <Check width={20} height={20} />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))}
              {query !== '' && (
                <div
                  onClick={checkAndCreateNewCategory}
                  className="relative flex gap-4 py-2 pl-10 pr-4 font-semibold text-indigo-500 cursor-pointer select-none hover:bg-indigo-600 hover:text-gray-200"
                >
                  <span>Create this category</span>
                  <CoinsStack
                    className="absolute flex items-center ml-3 bottom-1 -left-1"
                    width={25}
                    height={25}
                  />{' '}
                </div>
              )}
            </Combobox.Options>
          </div>
        </div>
      </Combobox>
      <span className="block h-4" />
    </>
  )
}
