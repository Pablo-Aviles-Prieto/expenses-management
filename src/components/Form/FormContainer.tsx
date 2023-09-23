import { Form } from 'formik'
import type { FC, ReactNode } from 'react'
import { textSize } from '@/utils/const'
import type { ICssSizes } from '@/interfaces'

type IProps = {
  children: ReactNode
  title: string
  containerWidth?: 'full' | 'none' | Exclude<ICssSizes, '8xl' | '9xl'>
  titleSize?: keyof typeof textSize
}

export const FormContainer: FC<IProps> = ({
  children,
  title,
  containerWidth = 'sm',
  titleSize = 'xl3'
}) => {
  return (
    <div className={`w-full  max-w-${containerWidth || 'sm'}`}>
      <Form>
        <h3 className={`mb-2 font-bold text-gray-300 ${textSize[titleSize || 'xl3']}`}>{title}</h3>
        {children}
      </Form>
    </div>
  )
}
