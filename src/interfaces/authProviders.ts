import { authProviders } from '@/utils/const'
import { ValuesOf } from './getValuesFromObj'

export type IProviders = ValuesOf<typeof authProviders>
