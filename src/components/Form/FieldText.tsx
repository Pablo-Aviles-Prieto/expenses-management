/* eslint-disable max-len */
import { ErrorMessage, Field, useField } from 'formik'
import { FC } from 'react'
import { FormInputContainer } from '../styles'

interface FieldTextProps {
  label: string
  id: string
  name: string
  type: string
  placeholder: string
  step?: string
  component?: 'input' | 'textarea'
  rows?: number
}

export const FieldText: FC<FieldTextProps> = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  const errorClass = meta.touched && meta.error ? 'border-red-500 border-2' : ''

  return (
    <FormInputContainer id={props.id} label={label}>
      <Field {...field} {...props} className={errorClass} as={props.component} />
      <p className="min-h-[25px] text-red-500">
        <ErrorMessage name={field.name} />
      </p>
    </FormInputContainer>
  )
}

FieldText.defaultProps = {
  step: '',
  component: 'input',
  rows: 1
}
