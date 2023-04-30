export const URL_API = process.env.API_URL

export const errorMessages = {
  authorizedResource: 'Not Authorized for this resource',
  createUser: 'Error creating the user',
  credentials: 'Check the credentials provided',
  emailRegistered: 'Email already registered',
  generic: 'Something went wrong. Try again later',
  invalidUserId: 'Invalid user ID',
  methodAllowed: 'Method Not Allowed',
  missingData: 'There is missing data in the request',
  parsingImg: 'Unable to parse the image'
}

export const textSize = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  xl2: 'text-2xl',
  xl3: 'text-3xl',
  xl4: 'text-4xl',
  xl5: 'text-5xl',
  xl6: 'text-6xl',
  xl7: 'text-7xl',
  xl8: 'text-8xl',
  xl9: 'text-9xl'
}

export const cssSizes = 'xs' || 'sm' || 'md' || 'lg' || 'xl' || '2xl' || '3xl' || '4xl' || '5xl' || '6xl' || '7xl'

export const dateFormat = {
  ISO: 'yyyy-MM-dd',
  US: 'MM-dd-yyyy',
  EU: 'dd-MM-yyyy'
} as const

export const switchSizes = {
  small: {
    container: 'h-[20px] w-[48px]',
    circle: 'h-[16px] w-[16px]',
    translate: 'translate-x-7'
  },
  medium: {
    container: 'h-[28px] w-[68px]',
    circle: 'h-[24px] w-[24px]',
    translate: 'translate-x-10'
  },
  large: {
    container: 'h-[32px] w-[76px]',
    circle: 'h-[28px] w-[28px]',
    translate: 'translate-x-11'
  }
}

export const switchBg = {
  purple: {
    active: 'bg-purple-500',
    inactive: 'bg-purple-900'
  },
  cyan: {
    active: 'bg-cyan-400',
    inactive: 'bg-cyan-700'
  }
}

export const COMMON_CATEGORIES = [
  { id: 1, name: 'Groceries' },
  { id: 2, name: 'Rent' },
  { id: 3, name: 'Transportation' },
  { id: 4, name: 'Entertainment' },
  { id: 5, name: 'Travel' },
  { id: 6, name: 'Shopping' },
  { id: 7, name: 'Gifts' }
]
