import { ProgressSpinner } from '@/components/styles/ProgressSpinner'
import { FC } from 'react'

type IProps = {
  classes?: string
  size: 'xs' | 'sm' | 'lg' | 'xl'
}

type ISizeOptions = {
  [Key in IProps['size']]: string
}

export const ProgressBarSpinner: FC<IProps> = ({ size, classes = '' }) => {
  const sizeOptions: ISizeOptions = {
    xs: 'w-[250px] h-[25px]',
    sm: 'w-[350px] h-[30px]',
    lg: 'w-[450px] h-[35px]',
    xl: 'w-[550px] h-[40px]'
  }

  return (
    <div className="flex items-center justify-center mt-32">
      <ProgressSpinner sizeClasses={sizeOptions[`${size}`]} classes={classes} />
    </div>
  )
}
