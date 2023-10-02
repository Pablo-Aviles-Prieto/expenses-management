/* eslint-disable max-len */

'use client'

import { TransactionObjBack } from '@/interfaces/Transactions'
import { FC, useEffect, useMemo, useState } from 'react'
import ReactPaginate from 'react-paginate'

type PropsI = {
  rawTransactions: TransactionObjBack[]
  filteredTransList: TransactionObjBack[] | undefined
  setTransPaginated: React.Dispatch<React.SetStateAction<TransactionObjBack[]>>
}

const MAX_ITEMS_PER_PAGE = 10

// TODO: Pagination should change a global state with the data to show in the list.
export const TransactionListPagination: FC<PropsI> = ({
  rawTransactions,
  filteredTransList,
  setTransPaginated
}) => {
  const transListToDisplay = useMemo(
    () => filteredTransList ?? rawTransactions,
    [filteredTransList, rawTransactions]
  )
  const [currentPage, setCurrentPage] = useState(0)
  const offset = currentPage * MAX_ITEMS_PER_PAGE
  const totalPages = Math.ceil((transListToDisplay.length - 1) / MAX_ITEMS_PER_PAGE)
  const isPrevDisabled = currentPage === 0
  const isNextDisabled = currentPage === totalPages - 1

  useEffect(() => {
    const currentPageData = transListToDisplay.slice(offset, offset + MAX_ITEMS_PER_PAGE)
    setTransPaginated(currentPageData)
  }, [offset, transListToDisplay])

  const handlePageChange = ({ selected: selectedPage }: { selected: number }) => {
    setCurrentPage(selectedPage)
  }

  return (
    <div className="flex items-center justify-between mt-6">
      <div>
        Displaying page{' '}
        <span className="text-lg font-bold text-indigo-300">{currentPage + 1} </span>
        of <span className="text-lg font-bold text-indigo-300">{totalPages}</span>
      </div>
      <ReactPaginate
        previousLabel={
          <div className="relative flex items-center">
            <span className="absolute -top-[8px] left-0 text-2xl">←</span>
            <span className="ml-6">Previous</span>
          </div>
        }
        nextLabel={
          <div className="relative flex items-center">
            <span className="absolute -top-[8px] right-0 text-2xl">→</span>
            <span className="mr-6">Next</span>
          </div>
        }
        pageCount={totalPages}
        onPageChange={handlePageChange}
        containerClassName="flex space-x-4"
        pageClassName=""
        pageLinkClassName="border border-gray-400 rounded px-2 py-1 inline-block hover:bg-indigo-700"
        previousClassName=""
        previousLinkClassName={`border border-gray-400 rounded px-2 py-1 inline-block ${
          isPrevDisabled ? 'text-gray-500 cursor-default' : 'hover:bg-indigo-700'
        }`}
        nextClassName=""
        nextLinkClassName={`border border-gray-400 rounded px-2 py-1 inline-block ${
          isNextDisabled ? 'text-gray-500 cursor-default' : 'hover:bg-indigo-700'
        }`}
        breakClassName=""
        breakLinkClassName="border border-gray-400 rounded px-2 py-1 inline-block hover:bg-indigo-700"
        activeClassName="bg-indigo-600 text-white inline-block"
        marginPagesDisplayed={1}
        pageRangeDisplayed={3}
      />
    </div>
  )
}
