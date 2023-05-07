import { ValuesOf } from '@/interfaces/getValuesFromObj'
import { authProviders } from './const'

export function isAuthProvider(provider: string): provider is ValuesOf<typeof authProviders> {
  return Object.values(authProviders).includes(provider as ValuesOf<typeof authProviders>)
}
