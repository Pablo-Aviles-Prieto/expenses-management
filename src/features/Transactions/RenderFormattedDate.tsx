'use client'

import { useDateFormat } from '@/hooks/useDateFormat'
import { format } from 'date-fns'
import { FC } from 'react'

type PropsI = {
  stringDate: string
}

export const RenderFormattedDate: FC<PropsI> = ({ stringDate }) => {
  const { dateFormatSelected } = useDateFormat()

  return <>{format(new Date(stringDate), dateFormatSelected)}</>
}
