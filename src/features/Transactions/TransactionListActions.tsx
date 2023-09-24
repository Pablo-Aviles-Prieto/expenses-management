'use client'

import { Edit, Info, Trash } from '@/components/icons'

export const TransactionListActions = () => {
  return (
    <>
      <button
        type="button"
        onClick={() => console.log('Redirect to a subpage and intercept it in a modal')}
      >
        <Info width={25} height={25} />
      </button>
      <button
        type="button"
        onClick={() =>
          console.log(
            'Redirect to a subpage and intercept, showing the form with the data populated'
          )
        }
      >
        <Edit width={25} height={25} />
      </button>
      <button
        type="button"
        onClick={() => console.log('Show a modal to confirm the delete action')}
      >
        <Trash width={25} height={25} />
      </button>
    </>
  )
}
