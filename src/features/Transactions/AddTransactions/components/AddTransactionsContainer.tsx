'use client'

import { FC, useState } from 'react'
import { AddTransactions } from '@/features/Transactions/AddTransactions/components/AddTransaction'
import { CardContainer } from '@/components/styles/CardContainer'
import { UploadTransFile } from '@/features/Transactions/AddTransactions/components/UploadTransFile'
import { CategoryI } from '@/interfaces'

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
        <UploadTransFile setIsManualTransExpanded={setIsManualTransExpanded} />
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
