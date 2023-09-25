/* eslint-disable max-len */

'use client'

import { useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'

const DROPDOWN_OPTIONS = ['All transactions', 'Incomes', 'Expenses']
const BGROUND_GRAY = 'bg-gray-200'

const Dropdown = () => {
  const [selectedOption, setSelectedOption] = useState(DROPDOWN_OPTIONS[0])

  return (
    <div className="flex items-center justify-center">
      <div className="min-w-[200px] max-w-lg mx-auto">
        <Listbox as="div" className="space-y-1" value={selectedOption} onChange={setSelectedOption}>
          {({ open }) => (
            <div className="relative">
              <span className="inline-block w-full shadow-sm rounded-xl">
                <Listbox.Button
                  className={`relative w-full py-2 pl-3 pr-10 text-left font-bold text-indigo-600
									 transition duration-150 ease-in-out ${BGROUND_GRAY} border border-gray-400
									  rounded-md cursor-default focus:outline-none focus:shadow-outline-blue
										 focus:border-indigo-200 sm:text-sm sm:leading-5`}
                >
                  <span className="block text-[15px] truncate">{selectedOption}</span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    {/* TODO: Extract the SVG */}
                    <svg
                      className="w-5 h-5 text-indigo-700"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Listbox.Button>
              </span>

              <Transition
                show={open}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                className={`absolute w-full mt-1 ${BGROUND_GRAY} rounded-md shadow-lg`}
              >
                <Listbox.Options
                  static
                  className="py-1 overflow-auto text-base leading-6 rounded-md shadow-xs max-h-60 focus:outline-none sm:text-sm sm:leading-5"
                >
                  {DROPDOWN_OPTIONS.map(option => (
                    <Listbox.Option key={option} value={option}>
                      {({ selected, active }) => (
                        <div
                          className={`${
                            active ? 'text-white bg-indigo-500' : 'text-gray-900'
                          } cursor-default select-none relative py-2 pl-8 pr-4`}
                        >
                          <span
                            className={`${
                              selected ? 'font-semibold text-white-600' : 'font-normal'
                            } block truncate`}
                          >
                            {option}
                          </span>
                          {selected && (
                            <span
                              className={`${
                                active ? 'text-white' : 'text-indigo-600'
                              } absolute inset-y-0 left-0 flex items-center pl-1.5`}
                            >
                              {/* TODO: Extract the SVG */}
                              <svg
                                className="w-5 h-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          )}
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          )}
        </Listbox>
      </div>
    </div>
  )
}

export default Dropdown
