/* eslint-disable max-len */
import React, { FC, SVGProps, useState } from 'react'
import { useField } from 'formik'
import { Combobox } from '@headlessui/react'
import { FormInputContainer } from '../styles'
import { Check, ChevronUpDown, Close } from '../icons'

// TODO: remove the ID and filter/find using name?
// or use uuid
type PropsT = {
  id: number
  name: string
  newEntry?: string
}

type MsgToCreateEntryI = {
  SVG: FC<SVGProps<SVGSVGElement>>
  message: string
}

interface PropsI<T extends PropsT> {
  label: string
  id: string
  name: string
  dataArray: T[]
  msgToCreateEntry?: MsgToCreateEntryI
  isRequired?: boolean
}

type FormikValue<T extends PropsT> = {
  typeValue: string
  dataValues: T[]
}

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ')
}

export const ComboboxField = <T extends PropsT>({
  label,
  id,
  dataArray,
  msgToCreateEntry,
  isRequired,
  ...props
}: PropsI<T>) => {
  const [query, setQuery] = useState('')
  const [elementList, setElementList] = useState<T[]>([...dataArray])
  const [field, meta, helpers] = useField<FormikValue<T>>(props)

  const inputDataHandler = ({ type, data }: { type?: string; data?: T[] }) => {
    const typeValue = type ?? field.value.typeValue
    const dataValues = data ?? field.value.dataValues
    helpers.setValue({ dataValues, typeValue })
  }

  const filteredPeople =
    query === ''
      ? elementList
      : elementList.filter(elemnt =>
          elemnt.name.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  const onComboboxChange = (dataElmnt: T[]) => {
    inputDataHandler({ data: dataElmnt })
    if (!meta.touched) {
      helpers.setTouched(true)
    }
  }

  const inputFocus = () => {
    if (query !== '') {
      setQuery('')
    }
    inputDataHandler({ type: '' })
  }

  const removeActiveElement = (element: T) => {
    const newFilteredArr = field.value.dataValues.filter(valueObj => valueObj.id !== element.id)
    inputDataHandler({ data: newFilteredArr })
  }

  const checkAndCreateNewEntry = () => {
    const newCategoryObj = {
      id: elementList.length + 1,
      name: query,
      newEntry: true
    } as unknown as T

    let alreadyExists: T | undefined

    setElementList(prevElements => {
      alreadyExists = prevElements.find(elm => elm.name.toLowerCase() === query.toLowerCase())
      return alreadyExists ? prevElements : [...prevElements, newCategoryObj]
    })

    const alreadyActive = field.value.dataValues.find(elm => elm.name.toLowerCase() === query.toLowerCase())
    if (alreadyActive) {
      setQuery('')
      inputDataHandler({ type: '' })
      return
    }

    const getElement = elementList.find(elm => elm.id === alreadyExists?.id)
    if (getElement) {
      inputDataHandler({ data: [...field.value.dataValues, getElement], type: '' })
      setQuery('')
      return
    }
    inputDataHandler({ data: [...field.value.dataValues, newCategoryObj], type: '' })
    setQuery('')
  }

  return (
    <>
      <Combobox value={field.value.dataValues} onChange={onComboboxChange} name="people" multiple>
        <div className="relative">
          <span className="inline-block w-full rounded-md shadow-sm">
            <FormInputContainer label={isRequired ? `${label}*` : label} id={id}>
              <span className="flex flex-wrap gap-2">
                {field.value.dataValues.map(element => (
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
                    {...field}
                    {...props}
                    value={field.value.typeValue}
                    onChange={e => {
                      setQuery(e.target.value)
                      inputDataHandler({ type: e.target.value })
                    }}
                    onFocus={inputFocus}
                    className="w-full text-gray-600 bg-gray-200 focus:outline-none"
                    placeholder="Type to search or create a category..."
                    id={id}
                    autoComplete="off"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        checkAndCreateNewEntry()
                      }
                    }}
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
                  onClick={checkAndCreateNewEntry}
                  className="relative flex gap-4 py-2 pl-10 pr-4 font-semibold text-indigo-500 cursor-pointer select-none hover:bg-indigo-600 hover:text-gray-200"
                >
                  <span>{msgToCreateEntry ? msgToCreateEntry.message : 'Create this entry'}</span>
                  {msgToCreateEntry?.SVG && (
                    <msgToCreateEntry.SVG
                      className="absolute flex items-center ml-3 bottom-1 -left-1"
                      width={25}
                      height={25}
                    />
                  )}
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

ComboboxField.defaultProps = {
  isRequired: false,
  msgToCreateEntry: undefined
}
