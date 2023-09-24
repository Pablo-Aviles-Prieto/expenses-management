/* eslint-disable max-len */

'use client'

import { ChevronDown } from '@/components/icons'
import { Popover, Transition } from '@headlessui/react'
import { FC, Fragment, ReactNode } from 'react'

type PropsI = {
  buttonValue: string
  panelContent: ReactNode
  panelWidth?: string
  isDisabled?: boolean
}

export const CustomPopover: FC<PropsI> = ({
  buttonValue,
  panelContent,
  panelWidth = 'max-w-md',
  isDisabled = false
}) => {
  return (
    <Popover className="relative mx-auto w-min">
      {({ open }) => (
        <>
          <Popover.Button
            disabled={isDisabled}
            className={`
                ${open ? '' : 'text-opacity-80'}
                group inline-flex items-center rounded-md ${
                  isDisabled ? 'bg-gray-500' : 'bg-blue-700'
                } px-3 py-2 text-slate-100 font-bold 
								text-base ${!isDisabled ? 'hover:text-opacity-100' : ''} focus:outline-none focus-visible:ring-2 
								focus-visible:ring-blue-500 focus-visible:ring-opacity-75 ${
                  !isDisabled ? 'hover:bg-blue-800' : ''
                }`}
          >
            <span>{buttonValue}</span>
            {!isDisabled ? (
              <ChevronDown
                className={`${open ? '' : 'text-opacity-70'}
                  ml-2 h-5 w-5 text-indigo-200 transition duration-150 ease-in-out group-hover:text-opacity-80`}
                aria-hidden="true"
              />
            ) : (
              <div className="w-[25px]" />
            )}
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel
              className={`absolute z-10 w-screen mt-3 transform -translate-x-1/2 left-1/2 ${panelWidth}`}
            >
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="px-3 py-2 min-h-[100px] flex items-center justify-center bg-indigo-500 text-neutral-300">
                  {panelContent}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}
