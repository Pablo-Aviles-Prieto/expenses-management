/* eslint-disable max-len */
import { FC, ReactNode } from 'react'
import { Spinner } from '../styles/Spinner'

type ColorType = {
  primary: string
  secondary: string
}

type IProps = {
  isLoading?: boolean
  isDisabled: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  colorType?: keyof ColorType
  children: ReactNode
}

const COLOR_TYPE: ColorType = {
  primary: 'bg-blue-500 hover:bg-blue-700',
  secondary: 'bg-stone-950 hover:bg-stone-900'
}

export const FormBtn: FC<IProps> = ({
  isLoading = false,
  isDisabled,
  type = 'submit',
  onClick = undefined,
  colorType = 'primary',
  children
}) => {
  return (
    <button
      className={`flex items-center gap-3 px-4 py-2 font-bold text-white rounded focus:outline-none focus:shadow-outline ${
        isDisabled ? 'bg-gray-500' : COLOR_TYPE[colorType]
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
