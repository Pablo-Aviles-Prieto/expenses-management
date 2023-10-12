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

  // TODO: The relog into your account should sign off the user and navigate
  // to the signin page
  if (!userResponse.ok || !('userCategories' in userResponse) || !userResponse.userCategories) {
    return <div>Error fetching the categories. Please relog into your account</div>
  }

  const categoriesList = Array.isArray(userResponse.userCategories)
    ? userResponse.userCategories
    : []

  return (
    <>
      <CardContainer containerWidth="full">
        <UploadTransBlock
          categoriesArray={categoriesList}
          setIsManualTransExpanded={setIsManualTransExpanded}
        />
      </CardContainer>
      <CardContainer containerWidth="full">
        <AddTransactions
          categoriesArray={categoriesList}
          isManualTransExpanded={isManualTransExpanded}
          setIsManualTransExpanded={setIsManualTransExpanded}
        />
      </CardContainer>
    </>
  )
}
