/* eslint-disable max-len */
import type { SVGProps, FC } from 'react'

export const ChevronDown: FC<SVGProps<SVGSVGElement>> = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="icon icon-tabler icon-tabler-chevron-down"
    viewBox="0 0 24 24"
    {...props}
  >
    <title>Expand</title>
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="m6 9 6 6 6-6" />
  </svg>
)
