import { FC } from 'react'
import '@/styles/progressBarSpinner.css'

type IProps = {
  classes?: string
  sizeClasses: string
}

export const ProgressSpinner: FC<IProps> = ({ sizeClasses, classes = '' }) => {
  return (
    <div
      className={`overflow-hidden relative rounded-[50px]
		 border-y-2 border-indigo-700 ${classes} ${sizeClasses}`}
    >
      <div
        className="loader w-full h-full absolute rounded-[50px] -left-[100%] 
			bg-gradient-to-r from-indigo-400 via-violet-500 to-purple-600"
      />
    </div>
  )
}
