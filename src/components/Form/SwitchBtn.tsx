/* eslint-disable max-len */
import { FC, useState } from 'react'
import { Switch } from '@headlessui/react'
import { switchSizes, switchBg } from '@/utils/const'

type SizesI = keyof typeof switchSizes
type BackgroundColorsI = keyof typeof switchBg

type PropsI = {
  label: string
  labelPosition?: 'left' | 'right'
  customClasses?: string
  enableAsDefault?: boolean
  size?: SizesI
  bgColor?: BackgroundColorsI
}

export const SwitchBtn: FC<PropsI> = ({ label, labelPosition, customClasses, enableAsDefault, size, bgColor }) => {
  const [enabled, setEnabled] = useState(enableAsDefault)

  const selectedSize = size ?? 'small'
  const bgroundColor = bgColor ?? 'purple'
  const labelPositioning = labelPosition ?? 'right'

  return (
    <Switch.Group>
      <div
        className={`flex items-center gap-2 w-fit ${labelPositioning === 'right' ? 'flex-row' : 'flex-row-reverse'} ${
          customClasses ?? ''
        }`}
      >
        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={`${enabled ? switchBg[bgroundColor].active : switchBg[bgroundColor].inactive}
					${switchSizes[selectedSize].container}
          relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors 
					duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          <span
            aria-hidden="true"
            className={`${enabled ? switchSizes[selectedSize].translate : 'translate-x-0'}
						${switchSizes[selectedSize].circle}
            pointer-events-none inline-block transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
        <Switch.Label className="mr-4">{label}</Switch.Label>
      </div>
    </Switch.Group>
  )
}

SwitchBtn.defaultProps = {
  labelPosition: undefined,
  customClasses: '',
  enableAsDefault: false,
  size: undefined,
  bgColor: undefined
}
