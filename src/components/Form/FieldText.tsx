/* eslint-disable max-len */
import { ErrorMessage, Field, useField } from 'formik'
import { FC } from 'react'

interface FieldTextProps {
  label: string
  id: string
  name: string
  type: string
  placeholder: string
}

export const FieldText: FC<FieldTextProps> = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  const errorClass = meta.touched && meta.error ? 'border-red-500 border-2' : ''

  return (
    <div className="mb-2">
      <label className="block mb-2 text-sm font-bold text-gray-200" htmlFor={props.id}>
        {label}
      </label>
      <Field
        {...field}
        {...props}
        className={`w-full px-3 py-2 leading-tight text-gray-600 bg-gray-200 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${errorClass}`}
      />
      <p className="min-h-[25px] text-red-500">
        <ErrorMessage name={field.name} />
      </p>
    </div>
  )
}
