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
  parsingImg: 'Unable to parse the image',
  relogAcc: 'Something happened, please relog into your account',
  gettingCategories: 'Error getting the categories',
  addingTransaction: 'Error adding the transaction to database',
  fileParsing: 'File processing failed. Try again later',
  fileType: 'Wrong file type. Only CSV is allowed',
  dateFormatCSV: 'Please, select the correct date format used on your CSV file'
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

export const maxWidthSize = {
  xs: 'max-w-xxs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
  none: 'max-w-none',
  minContent: 'max-w-min',
  maxContent: 'max-w-max',
  fit: 'max-w-fit',
  prose: 'max-w-prose'
}

export const cssSizes =
  'xs' || 'sm' || 'md' || 'lg' || 'xl' || '2xl' || '3xl' || '4xl' || '5xl' || '6xl' || '7xl'

export const dateFormat = {
  ISO: 'yyyy-MM-dd',
  US: 'MM/dd/yyyy',
  EU: 'dd/MM/yyyy'
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

export const authProviders = {
  google: 'google'
} as const

export const FIELDS_FROM_CSV = ['Date', 'Concept', 'Amount', 'Notes']
