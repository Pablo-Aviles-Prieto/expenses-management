import { Session } from 'next-auth'
import { FC } from 'react'

type IProp = {
  data: Session
  classes?: string
}

export const HeaderProfileImg: FC<IProp> = ({ data, classes = '' }) => {
  const imageUrl = data.user?.image
    ? `/api/proxy-image?imageUrl=${encodeURIComponent(data.user.image)}`
    : ''

  return (
    <div className={`rounded-full overflow-hidden ${classes}`}>
      <img className="object-cover w-full h-full" src={imageUrl} alt={data.user?.name || ''} />
    </div>
  )
}
