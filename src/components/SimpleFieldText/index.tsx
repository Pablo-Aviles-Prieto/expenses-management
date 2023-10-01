'use client'

import { FC } from 'react'
import { FormInputContainer } from '../styles'

interface FieldTextProps {
  id: string
  onChange: React.Dispatch<React.SetStateAction<string>>
  placeholder?: string
  classes?: string
  type?: string
  step?: string
}

export const SimpleFieldText: FC<FieldTextProps> = ({
  id,
  onChange,
  placeholder = '',
  classes = '',
  type = 'text',
  step = undefined
}) => {
  return (
    <FormInputContainer id="" label="" removeLabel removeMargins>
      <input
        className={classes}
        onChange={e => onChange(e.target.value)}
        type={type}
        id={id}
        placeholder={placeholder ?? 'Enter data'}
        step={step}
      />
    </FormInputContainer>
  )
}
