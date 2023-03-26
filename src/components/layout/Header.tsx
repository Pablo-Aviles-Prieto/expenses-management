import type { FC } from 'react'

type PropsI = {
  classes?: string
}

export const Header: FC<PropsI> = ({ classes = '' }) => {
  return (
    <div className={`h-16 flex items-center justify-between shadow-md ${classes}`}>
      <h3 className="font-semibold text-2xl">ExpenseManager</h3>
      <p>some icons</p>
    </div>
  )
}

Header.defaultProps = {
  classes: ''
}
