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

  // if (!userResponse.ok || !userResponse?.userCategories) {
  // }

  // const categoriesArray = useMemo(
  //   () => (Array.isArray(userResponse?.userCategories) ? userResponse.userCategories : []),
  //   [userResponse]
  // )

  // TODO: check userResponse.error to throw an error
  return (
    <>
      <CardContainer containerWidth="full">
        <UploadTransBlock
          userResponse={userResponse}
          setIsManualTransExpanded={setIsManualTransExpanded}
        />
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
