/* eslint-disable max-len */
import { FC } from 'react'

type IProps = {
  classes: string
  size: 'xs' | 'sm' | 'lg' | 'xl'
}

type IBorderOptions = {
  [Key in IProps['size']]: string
}

export const Spinner: FC<IProps> = ({ classes, size }) => {
  const borderOptions: IBorderOptions = {
    xs: 'border-2',
    sm: 'border-4',
    lg: 'border-6',
    xl: 'border-8'
  }
  return (
    <div
      className={`border-solid rounded-full shadow-md animate-spin border-t-transparent ${classes} ${borderOptions[size]}`}
    />
  )
}
