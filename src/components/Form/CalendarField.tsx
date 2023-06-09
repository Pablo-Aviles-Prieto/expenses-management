/* eslint-disable react/jsx-no-useless-fragment */
import React, { FC } from 'react'
import { ErrorMessage, useField } from 'formik'
import DatePicker from 'react-datepicker'
import { useDateFormat } from '@/hooks/useDateFormat'
import { DateFormatValues } from '@/interfaces'
import { format } from 'date-fns'
import { FormInputContainer } from '../styles'

interface PropsI {
  label: string
  id: string
  name: string
  customClass?: string
  isClearable?: boolean
  placeholderText?: string
  customDateFormat?: DateFormatValues
  removeErrMsg?: boolean
  onChange?: (date: Date | null) => void
  isRequired?: boolean
}

export const CalendarField: FC<PropsI> = ({ label, id, customClass, removeErrMsg, onChange, isRequired, ...props }) => {
  const { dateFormatSelected } = useDateFormat()
  const [field, meta, helpers] = useField(props)

  const handleChange = (value: Date | null) => {
    if (!meta.touched) {
      helpers.setTouched(true)
    }
    if (onChange) {
      onChange(value)
    }
    helpers.setValue(value)
  }

  return (
    <FormInputContainer id={id} label={isRequired ? `${label}*` : label}>
      <DatePicker
        {...field}
        {...props}
        id={id}
        className={`${customClass ?? ''} ${meta.touched && meta.error ? 'border-red-500 border-2' : ''}`}
        highlightDates={[new Date()]}
        selected={field.value ? new Date(field.value as string) : null}
        onChange={handleChange}
        isClearable={props.isClearable}
        placeholderText={
          props.placeholderText ||
          `Select or introduce a date (i.e ${format(new Date(), props.customDateFormat || dateFormatSelected)})`
        }
        dateFormat={props.customDateFormat || dateFormatSelected}
        autoComplete="off"
      />
      {!removeErrMsg ? (
        <p className="min-h-[25px] text-red-500">
          <ErrorMessage name={field.name} />
        </p>
      ) : (
        <></>
      )}
    </FormInputContainer>
  )
}

CalendarField.defaultProps = {
  customClass: '',
  isClearable: true,
  placeholderText: undefined,
  customDateFormat: undefined,
  onChange: undefined,
  removeErrMsg: false,
  isRequired: false
}
