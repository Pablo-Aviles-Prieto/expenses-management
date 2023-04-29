/* eslint-disable max-len */
import type { SVGProps, FC } from 'react'

export const Check: FC<SVGProps<SVGSVGElement>> = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2.5}
    className="icon icon-tabler icon-tabler-check"
    viewBox="0 0 24 24"
    {...props}
  >
    <title>Check</title>
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="m5 12 5 5L20 7" />
  </svg>
)
