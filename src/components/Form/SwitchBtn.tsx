/* eslint-disable max-len */
import { FC } from 'react'
import { Switch } from '@headlessui/react'
import { switchSizes, switchBg } from '@/utils/const'
import { ErrorMessage, useField } from 'formik'

type SizesI = keyof typeof switchSizes
type BackgroundColorsI = keyof typeof switchBg

type PropsI = {
  label: string
  name: string
  labelPosition?: 'left' | 'right'
  customClasses?: string
  size?: SizesI
  bgColor?: BackgroundColorsI
}

export const SwitchBtn: FC<PropsI> = ({ label, name, labelPosition, customClasses, size, bgColor, ...props }) => {
  // const [enabled, setEnabled] = useState(enableAsDefault)
  const [field, meta, helpers] = useField<boolean>({ name, ...props })

  const handleChange = (value: boolean) => {
    if (!meta.touched) {
      helpers.setTouched(true)
    }
    helpers.setValue(value)
  }

  const selectedSize = size ?? 'small'
  const bgroundColor = bgColor ?? 'purple'
  const labelPositioning = labelPosition ?? 'right'

  return (
    <Switch.Group>
      <div className={customClasses ?? ''}>
        <div
          className={`flex items-center gap-2 w-fit ${labelPositioning === 'right' ? 'flex-row' : 'flex-row-reverse'}`}
        >
          <Switch
            checked={field.value}
            onChange={handleChange}
            name={name}
            className={`${field.value ? switchBg[bgroundColor].active : switchBg[bgroundColor].inactive}
					${switchSizes[selectedSize].container}
          relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors 
					duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
          >
            <span
              aria-hidden="true"
              className={`${field.value ? switchSizes[selectedSize].translate : 'translate-x-0'}
						${switchSizes[selectedSize].circle}
            pointer-events-none inline-block transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
          <Switch.Label className="mr-4">{label}</Switch.Label>
        </div>
        <p className="min-h-[25px] text-red-500">
          <ErrorMessage name={field.name} />
        </p>
      </div>
    </Switch.Group>
  )
}

SwitchBtn.defaultProps = {
  labelPosition: undefined,
  customClasses: '',
  size: undefined,
  bgColor: undefined
}
