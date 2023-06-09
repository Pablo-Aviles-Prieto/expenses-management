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

export const FormContainer: FC<IProps> = ({ children, title, containerWidth, titleSize }) => {
  return (
    <div className={`w-full  max-w-${containerWidth || 'sm'}`}>
      <Form className="px-8 pt-6 pb-8 mb-4 bg-indigo-700 rounded shadow-md">
        <h3 className={`mb-2 font-bold ${textSize[titleSize || 'xl3']}`}>{title}</h3>
        {children}
      </Form>
    </div>
  )
}

FormContainer.defaultProps = {
  containerWidth: 'sm',
  titleSize: 'xl3'
}
