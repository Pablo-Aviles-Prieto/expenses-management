/* eslint-disable max-len */
import type { SVGProps, FC } from 'react'

export const Close: FC<SVGProps<SVGSVGElement>> = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M6 18 18 6M6 6l12 12" />
  </svg>
)
