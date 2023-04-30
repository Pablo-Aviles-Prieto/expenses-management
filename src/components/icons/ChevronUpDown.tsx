/* eslint-disable max-len */
import type { SVGProps, FC } from 'react'

export const ChevronUpDown: FC<SVGProps<SVGSVGElement>> = props => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 20 20" strokeWidth={1.5} {...props}>
    <path d="m7 7 3-3 3 3m0 6-3 3-3-3" />
  </svg>
)
