/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable max-len */
import { FC, ReactElement, cloneElement } from 'react'

interface PropsI {
  label: string
  id: string
  children: ReactElement | ReactElement[]
}

export const FormInputContainer: FC<PropsI> = ({ label, id, children }) => {
  const defaultClassName = `w-full px-3 py-2 leading-tight text-gray-600 bg-gray-200 border rounded shadow appearance-none focus:outline-none focus:shadow-outline`

  const StyledChildren = Array.isArray(children)
    ? children.map((child, index) => {
        return cloneElement(child, {
          // eslint-disable-next-line react/no-array-index-key
          key: index,
          className: index === 0 ? `${defaultClassName} ${child.props.className ?? ''}` : child.props.className ?? ''
        })
      })
    : cloneElement(children, {
        className: `${defaultClassName} ${children.props.className ?? ''}`
      })

  return (
    <div className="mb-2">
      <label className="block mb-2 text-sm font-bold text-gray-200" htmlFor={id}>
        {label}
      </label>
      {StyledChildren}
    </div>
  )
}