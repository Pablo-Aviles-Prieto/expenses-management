'use client'

import { FC, useState } from 'react'
import { AddTransactions } from '@/features/Transactions/AddTransactions/components/AddTransaction'
import { CardContainer } from '@/components/styles/CardContainer'
import { CategoryI } from '@/interfaces'
import { UploadTransBlock } from './UploadTransBlock'

type Props = {
  userResponse:
    | {
        ok: boolean
        userCategories: CategoryI[]
      }
    | {
        ok: boolean
        error: string
      }
}

export const AddTransactionsContainer: FC<Props> = ({ userResponse }) => {
  const [isManualTransExpanded, setIsManualTransExpanded] = useState(true)

  // TODO: check in the child if userResponse.error exist and work accordingly
  return (
    <>
      <CardContainer containerWidth="full">
        <UploadTransBlock setIsManualTransExpanded={setIsManualTransExpanded} />
      </CardContainer>
      <CardContainer containerWidth="full">
        <AddTransactions
          userResponse={userResponse}
          isManualTransExpanded={isManualTransExpanded}
          setIsManualTransExpanded={setIsManualTransExpanded}
        />
      </CardContainer>
    </>
  )
}
