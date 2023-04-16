/* eslint-disable max-len */
import { FC, ReactNode } from 'react'
import { Spinner } from '../styles/Spinner'

type IProps = {
  isLoading?: boolean
  isDisabled: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  children: ReactNode
}

export const FormBtn: FC<IProps> = ({ isLoading, isDisabled, type, onClick, children }) => {
  return (
    <button
      className={`flex items-center gap-3 px-4 py-2 font-bold text-white rounded focus:outline-none focus:shadow-outline ${
        isDisabled ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700'
      }`}
      // eslint-disable-next-line react/button-has-type
      type={type}
      disabled={isDisabled}
      onClick={onClick}
    >
      {isLoading && <Spinner size="xs" classes="border-violet-400 w-6 h-6" />}
      {children}
    </button>
  )
}

FormBtn.defaultProps = {
  isLoading: false,
  type: 'submit',
  onClick: undefined
}
