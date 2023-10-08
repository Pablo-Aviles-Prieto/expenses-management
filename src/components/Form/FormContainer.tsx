import { Form } from 'formik'
import { textSize } from '@/utils/const'
import type { FC, ReactNode } from 'react'

type IProps = {
  children: ReactNode
  title: string
  titleSize?: keyof typeof textSize
}

export const FormContainer: FC<IProps> = ({ children, title, titleSize = 'xl3' }) => {
  return (
    <div className="w-full">
      <Form>
        <h3 className={`mb-2 font-bold text-gray-300 ${textSize[titleSize || 'xl3']}`}>{title}</h3>
        {children}
      </Form>
    </div>
  )
}
