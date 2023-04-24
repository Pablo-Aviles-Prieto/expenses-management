import { dateFormat } from '@/utils/const'

export type DateFormatValues = (typeof dateFormat)[keyof typeof dateFormat]
